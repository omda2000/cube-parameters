
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();
  
  // Refs to track loading state and prevent excessive updates
  const lastObjectCountRef = useRef(0);
  const rebuildTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRebuildingRef = useRef(false);

  // Stable object count calculation
  const stableObjectCount = useMemo(() => {
    if (!scene) return 0;
    let count = 0;
    scene.traverse(() => count++);
    return count;
  }, [scene, loadedModels.length]);

  // Debounced scene rebuild to prevent excessive updates during loading
  const debouncedRebuildScene = useCallback(() => {
    if (rebuildTimeoutRef.current) {
      clearTimeout(rebuildTimeoutRef.current);
    }
    
    rebuildTimeoutRef.current = setTimeout(() => {
      if (isRebuildingRef.current) return;
      
      isRebuildingRef.current = true;
      setIsLoading(true);
      
      try {
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
        lastObjectCountRef.current = stableObjectCount;
      } catch (error) {
        console.error('Error rebuilding scene objects:', error);
      } finally {
        setIsLoading(false);
        isRebuildingRef.current = false;
      }
    }, 150); // 150ms debounce to allow loading to complete
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, stableObjectCount]);

  // Rebuild scene objects with loading detection
  useEffect(() => {
    if (!scene) {
      setSceneObjects([]);
      return;
    }

    // Detect if we're in a loading state (object count is changing rapidly)
    const currentCount = stableObjectCount;
    const isCountChanging = Math.abs(currentCount - lastObjectCountRef.current) > 0;
    
    if (isCountChanging) {
      setIsLoading(true);
    }

    debouncedRebuildScene();

    return () => {
      if (rebuildTimeoutRef.current) {
        clearTimeout(rebuildTimeoutRef.current);
      }
    };
  }, [debouncedRebuildScene]);

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
    // Batch visibility updates to prevent excessive re-renders
    sceneObject.object.visible = !sceneObject.object.visible;
    
    // Update children visibility recursively
    sceneObject.object.traverse((child) => {
      child.visible = sceneObject.object.visible;
    });
    
    // Force a single re-render after a short delay
    setTimeout(() => {
      setSceneObjects(prev => [...prev]);
    }, 50);
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
      
      // Dispose resources
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
      
      if (sceneObject.type === 'point' && sceneObject.object instanceof THREE.Mesh) {
        sceneObject.object.geometry?.dispose();
        if (Array.isArray(sceneObject.object.material)) {
          sceneObject.object.material.forEach(mat => mat.dispose());
        } else {
          sceneObject.object.material?.dispose();
        }
      }
      
      // Trigger rebuild after deletion
      debouncedRebuildScene();
    }
  }, [scene, debouncedRebuildScene]);

  // Cleanup on unmount
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
    isLoading,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete,
    clearSelection
  };
};
