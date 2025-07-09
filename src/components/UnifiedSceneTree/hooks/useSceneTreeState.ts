
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
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();
  
  // Stable refs to prevent unnecessary rebuilds
  const sceneObjectsRef = useRef<SceneObject[]>([]);
  const lastBuildParamsRef = useRef<string>('');
  const rebuildTimeoutRef = useRef<NodeJS.Timeout>();
  const isRebuildingRef = useRef(false);

  // Create a stable hash of build parameters to detect actual changes
  const buildParamsHash = useMemo(() => {
    const params = {
      sceneUuid: scene?.uuid || '',
      modelCount: loadedModels.length,
      modelIds: loadedModels.map(m => m.id).sort().join(','),
      showPrimitives,
      searchQuery: searchQuery.trim().toLowerCase(),
      showSelectedOnly,
      selectedIds: selectedObjects.map(obj => obj.id).sort().join(',')
    };
    return JSON.stringify(params);
  }, [scene?.uuid, loadedModels, showPrimitives, searchQuery, showSelectedOnly, selectedObjects]);

  // Debounced and optimized scene rebuild
  const debouncedRebuild = useCallback(() => {
    // Prevent multiple simultaneous rebuilds
    if (isRebuildingRef.current) return;
    
    if (rebuildTimeoutRef.current) {
      clearTimeout(rebuildTimeoutRef.current);
    }

    rebuildTimeoutRef.current = setTimeout(() => {
      // Double-check if rebuild is still needed
      if (buildParamsHash === lastBuildParamsRef.current) {
        return;
      }

      isRebuildingRef.current = true;
      
      try {
        let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
        
        // Apply selected-only filter FIRST (most restrictive)
        if (showSelectedOnly && selectedObjects.length > 0) {
          const selectedIds = new Set(selectedObjects.map(obj => obj.id));
          objects = objects.filter(obj => {
            const checkSelected = (sceneObj: SceneObject): boolean => {
              if (selectedIds.has(sceneObj.id)) return true;
              return sceneObj.children.some(child => checkSelected(child));
            };
            return checkSelected(obj);
          });
        }
        
        // Apply search filter (less expensive)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          objects = objects.filter(obj => 
            obj.name.toLowerCase().includes(query)
          );
        }
        
        // Only update if objects actually changed
        const objectsChanged = JSON.stringify(objects.map(o => o.id)) !== 
                              JSON.stringify(sceneObjectsRef.current.map(o => o.id));
        
        if (objectsChanged) {
          sceneObjectsRef.current = objects;
          setSceneObjects(objects);
        }
        
        lastBuildParamsRef.current = buildParamsHash;
      } catch (error) {
        console.error('Error rebuilding scene objects:', error);
      } finally {
        isRebuildingRef.current = false;
      }
    }, 150); // Increased debounce for better stability
  }, [scene, loadedModels, showPrimitives, searchQuery, showSelectedOnly, selectedObjects, buildParamsHash]);

  // Only rebuild when parameters actually change
  useEffect(() => {
    if (buildParamsHash !== lastBuildParamsRef.current) {
      debouncedRebuild();
    }
  }, [buildParamsHash, debouncedRebuild]);

  // Optimized toggle functions with minimal re-renders
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
    // Batch visibility changes to prevent multiple renders
    const newVisibility = !sceneObject.object.visible;
    
    // Update object visibility
    sceneObject.object.visible = newVisibility;
    
    // Update children visibility
    sceneObject.object.traverse((obj) => {
      obj.visible = newVisibility;
      if (obj instanceof THREE.Mesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.needsUpdate = true);
        } else {
          obj.material.needsUpdate = true;
        }
      }
    });
    
    // Force minimal re-render by updating only expanded nodes
    setExpandedNodes(prev => new Set(prev));
  }, []);

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
      
      // Dispose resources properly
      const disposeObject = (obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material?.dispose();
          }
        } else if (obj instanceof THREE.Line) {
          obj.geometry?.dispose();
          (obj.material as THREE.Material)?.dispose();
        }
      };

      if (sceneObject.object instanceof THREE.Group) {
        sceneObject.object.children.forEach(disposeObject);
      } else {
        disposeObject(sceneObject.object);
      }
      
      // Trigger rebuild after deletion
      setTimeout(() => debouncedRebuild(), 50);
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
