
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import type { LoadedModel, SceneObject } from '../../../types/model';
import { buildSceneObjects } from '../utils/sceneObjectBuilder';

export const useSceneTreeState = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  searchQuery: string = '',
  showSelectedOnly: boolean = false
) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [lastSceneVersion, setLastSceneVersion] = useState(0);
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();
  
  // Use refs to track previous values and prevent unnecessary rebuilds
  const prevSearchQueryRef = useRef(searchQuery);
  const prevShowSelectedOnlyRef = useRef(showSelectedOnly);
  const rebuildTimeoutRef = useRef<NodeJS.Timeout>();

  // Create a stable scene version to track actual changes
  const sceneVersion = useMemo(() => {
    if (!scene) return 0;
    let version = 0;
    scene.traverse(() => {
      version++;
    });
    return version + loadedModels.length;
  }, [scene, loadedModels.length]);

  // Debounced scene rebuild to prevent excessive updates
  const debouncedRebuild = useCallback(() => {
    if (rebuildTimeoutRef.current) {
      clearTimeout(rebuildTimeoutRef.current);
    }

    rebuildTimeoutRef.current = setTimeout(() => {
      let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
      
      // Apply selected-only filter FIRST
      if (showSelectedOnly) {
        const selectedIds = new Set(selectedObjects.map(obj => obj.id));
        objects = objects.filter(obj => {
          const checkSelected = (sceneObj: SceneObject): boolean => {
            if (selectedIds.has(sceneObj.id)) return true;
            return sceneObj.children.some(child => checkSelected(child));
          };
          return checkSelected(obj);
        });
      }
      
      // Apply search filter
      if (searchQuery.trim()) {
        objects = objects.filter(obj => 
          obj.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setSceneObjects(objects);
      setLastSceneVersion(sceneVersion);
    }, 50); // 50ms debounce
  }, [scene, loadedModels, showPrimitives, searchQuery, showSelectedOnly, sceneVersion, selectedObjects]);

  // Build unified scene tree only when necessary
  useEffect(() => {
    const searchChanged = searchQuery !== prevSearchQueryRef.current;
    const showSelectedOnlyChanged = showSelectedOnly !== prevShowSelectedOnlyRef.current;
    const sceneChanged = sceneVersion !== lastSceneVersion;

    if (sceneChanged || searchChanged || showSelectedOnlyChanged) {
      debouncedRebuild();
      
      prevSearchQueryRef.current = searchQuery;
      prevShowSelectedOnlyRef.current = showSelectedOnly;
    }
  }, [searchQuery, showSelectedOnly, sceneVersion, lastSceneVersion, debouncedRebuild]);

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });
  }, []);

  const toggleVisibility = useCallback((sceneObject: SceneObject) => {
    // Toggle the object's visibility
    sceneObject.object.visible = !sceneObject.object.visible;
    
    // Force renderer update by marking materials as needing update
    if (scene) {
      sceneObject.object.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.needsUpdate = true);
          } else {
            obj.material.needsUpdate = true;
          }
        }
      });
    }
    
    // Trigger a minimal re-render by updating expanded nodes
    setExpandedNodes(prev => new Set(prev));
  }, [scene]);

  const handleObjectSelect = useCallback((sceneObject: SceneObject, isMultiSelect?: boolean) => {
    if (isMultiSelect) {
      toggleSelection(sceneObject);
    } else {
      selectObject(sceneObject);
    }
  }, [selectObject, toggleSelection]);

  const handleDelete = useCallback((sceneObject: SceneObject, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (sceneObject.type === 'point' || sceneObject.type === 'measurement') {
      // Remove from scene
      scene?.remove(sceneObject.object);
      
      // Dispose geometry and material for measurement groups
      if (sceneObject.type === 'measurement' && sceneObject.object instanceof THREE.Group) {
        sceneObject.object.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material?.dispose();
            }
          } else if (child instanceof THREE.Line) {
            child.geometry?.dispose();
            (child.material as THREE.Material)?.dispose();
          }
        });
      }
      
      // Dispose geometry and material for points
      if (sceneObject.type === 'point' && sceneObject.object instanceof THREE.Mesh) {
        sceneObject.object.geometry?.dispose();
        if (Array.isArray(sceneObject.object.material)) {
          sceneObject.object.material.forEach(mat => mat.dispose());
        } else {
          sceneObject.object.material?.dispose();
        }
      }
      
      // Trigger rebuild
      debouncedRebuild();
    }
  }, [scene, debouncedRebuild]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (rebuildTimeoutRef.current) {
        clearTimeout(rebuildTimeoutRef.current);
      }
    };
  }, []);

  return {
    expandedNodes,
    sceneObjects,
    selectedObjects,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete,
    clearSelection
  };
};
