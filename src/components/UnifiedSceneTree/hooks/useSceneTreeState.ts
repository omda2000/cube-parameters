
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const { selectedObjects, selectObject, toggleSelection, clearSelection } =
    useSelectionContext();

  // String representation of selection to use in dependency arrays
  const selectionKey = showSelectedOnly
    ? selectedObjects.map((o) => o.id).join('|')
    : '';
  
  // Use a ref to track the last scene state to avoid unnecessary rebuilds
  const lastSceneStateRef = useRef<{
    sceneChildren: number;
    modelsLength: number;
    showPrimitives: boolean;
    searchQuery: string;
    showSelectedOnly: boolean;
    selectionKey: string;
  } | null>(null);

  const rebuildSceneObjects = useCallback(() => {
    if (!scene) {
      setSceneObjects([]);
      setIsLoading(false);
      return;
    }

    // Check if we actually need to rebuild
    const currentState = {
      sceneChildren: scene.children.length,
      modelsLength: loadedModels.length,
      showPrimitives,
      searchQuery,
      showSelectedOnly,
      selectionKey
    };

    // Only rebuild if something actually changed
    if (
      lastSceneStateRef.current &&
      lastSceneStateRef.current.sceneChildren === currentState.sceneChildren &&
      lastSceneStateRef.current.modelsLength === currentState.modelsLength &&
      lastSceneStateRef.current.showPrimitives === currentState.showPrimitives &&
      lastSceneStateRef.current.searchQuery === currentState.searchQuery &&
      lastSceneStateRef.current.showSelectedOnly === currentState.showSelectedOnly &&
      lastSceneStateRef.current.selectionKey === currentState.selectionKey
    ) {
      return;
    }

    console.log('Building scene objects - state changed:', currentState);
    setIsLoading(true);

    try {
      // Build objects
      let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
      
      // Apply filters
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
      
      if (searchQuery.trim()) {
        objects = objects.filter(obj => 
          obj.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      console.log('Scene objects built successfully:', objects.length);
      setSceneObjects(objects);
      lastSceneStateRef.current = currentState;
    } catch (error) {
      console.error('Error building scene objects:', error);
      setSceneObjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [scene, loadedModels, showPrimitives, selectionKey, searchQuery, showSelectedOnly]);

  // Rebuild when dependencies change, but with a small delay to batch updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      rebuildSceneObjects();
    }, 50); // Small delay to batch rapid changes

    return () => clearTimeout(timeoutId);
  }, [rebuildSceneObjects]);

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
    sceneObject.object.visible = !sceneObject.object.visible;
    sceneObject.object.traverse((child) => {
      child.visible = sceneObject.object.visible;
    });
    
    // Force a minimal re-render without full rebuild
    setSceneObjects(prev => [...prev]);
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
      
      // Clear the last state to force rebuild
      lastSceneStateRef.current = null;
      rebuildSceneObjects();
    }
  }, [scene, rebuildSceneObjects]);

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
