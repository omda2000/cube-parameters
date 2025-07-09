
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
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();
  
  // Enhanced debouncing and stability tracking
  const rebuildTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSceneStateRef = useRef<{
    sceneChildren: number;
    modelsLength: number;
    showPrimitives: boolean;
    searchQuery: string;
    showSelectedOnly: boolean;
    timestamp: number;
  } | null>(null);
  const stableStateRef = useRef<{
    objects: SceneObject[];
    timestamp: number;
  } | null>(null);

  const rebuildSceneObjects = useCallback(() => {
    if (!scene) {
      console.log('Scene tree: No scene available');
      setSceneObjects([]);
      setIsLoading(false);
      return;
    }

    const currentState = {
      sceneChildren: scene.children.length,
      modelsLength: loadedModels.length,
      showPrimitives,
      searchQuery,
      showSelectedOnly,
      timestamp: Date.now()
    };

    // Enhanced stability check - only rebuild if significant changes occurred
    if (lastSceneStateRef.current && 
        lastSceneStateRef.current.sceneChildren === currentState.sceneChildren &&
        lastSceneStateRef.current.modelsLength === currentState.modelsLength &&
        lastSceneStateRef.current.showPrimitives === currentState.showPrimitives &&
        lastSceneStateRef.current.searchQuery === currentState.searchQuery &&
        lastSceneStateRef.current.showSelectedOnly === currentState.showSelectedOnly &&
        (currentState.timestamp - lastSceneStateRef.current.timestamp) < 1000) { // Minimum 1 second between rebuilds
      console.log('Scene tree: State stable, skipping rebuild');
      return;
    }

    console.log('Scene tree: Building objects due to state change:', {
      children: currentState.sceneChildren,
      models: currentState.modelsLength
    });
    
    setIsLoading(true);

    try {
      let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
      
      // Apply filters efficiently
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
        const query = searchQuery.toLowerCase();
        objects = objects.filter(obj => 
          obj.name.toLowerCase().includes(query)
        );
      }
      
      // Store stable state
      stableStateRef.current = {
        objects,
        timestamp: currentState.timestamp
      };
      
      console.log('Scene tree: Objects built successfully:', objects.length);
      setSceneObjects(objects);
      lastSceneStateRef.current = currentState;
    } catch (error) {
      console.error('Scene tree: Error building objects:', error);
      // Fallback to previous stable state if available
      if (stableStateRef.current) {
        console.log('Scene tree: Using previous stable state');
        setSceneObjects(stableStateRef.current.objects);
      } else {
        setSceneObjects([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly]);

  // Enhanced debounced rebuild with proper cleanup
  useEffect(() => {
    // Clear existing timeout
    if (rebuildTimeoutRef.current) {
      clearTimeout(rebuildTimeoutRef.current);
    }

    // Set new timeout with longer delay to prevent flickering
    rebuildTimeoutRef.current = setTimeout(() => {
      rebuildSceneObjects();
    }, 200); // Increased delay to prevent rapid rebuilds

    return () => {
      if (rebuildTimeoutRef.current) {
        clearTimeout(rebuildTimeoutRef.current);
      }
    };
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
    
    // Use minimal update without triggering full rebuild
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
      
      // Force rebuild after deletion
      lastSceneStateRef.current = null;
      stableStateRef.current = null;
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
