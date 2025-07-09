
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
  
  // Simplified state tracking
  const lastBuildRef = useRef<{
    sceneChildrenCount: number;
    modelsCount: number;
    showPrimitives: boolean;
    searchQuery: string;
    showSelectedOnly: boolean;
  } | null>(null);
  
  const buildTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buildSceneObjectsStable = useCallback(() => {
    if (!scene) {
      console.log('Scene tree: No scene available');
      setSceneObjects([]);
      setIsLoading(false);
      return;
    }

    const currentState = {
      sceneChildrenCount: scene.children.length,
      modelsCount: loadedModels.length,
      showPrimitives,
      searchQuery,
      showSelectedOnly
    };

    // Only rebuild if there's a significant state change
    if (lastBuildRef.current &&
        lastBuildRef.current.sceneChildrenCount === currentState.sceneChildrenCount &&
        lastBuildRef.current.modelsCount === currentState.modelsCount &&
        lastBuildRef.current.showPrimitives === currentState.showPrimitives &&
        lastBuildRef.current.searchQuery === currentState.searchQuery &&
        lastBuildRef.current.showSelectedOnly === currentState.showSelectedOnly) {
      return;
    }

    console.log('Scene tree: Building objects, scene children:', currentState.sceneChildrenCount);
    
    setIsLoading(true);

    try {
      let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
      
      console.log('Scene tree: Initial objects built:', objects.length);
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const filterObjects = (objs: SceneObject[]): SceneObject[] => {
          return objs.filter(obj => {
            if (obj.name.toLowerCase().includes(query)) return true;
            // Check if any children match
            const filteredChildren = filterObjects(obj.children);
            if (filteredChildren.length > 0) {
              obj.children = filteredChildren;
              return true;
            }
            return false;
          });
        };
        objects = filterObjects(objects);
      }
      
      // Apply selection filter
      if (showSelectedOnly) {
        const selectedIds = new Set(selectedObjects.map(obj => obj.id));
        const filterSelected = (objs: SceneObject[]): SceneObject[] => {
          return objs.filter(obj => {
            if (selectedIds.has(obj.id)) return true;
            // Check if any children are selected
            const filteredChildren = filterSelected(obj.children);
            if (filteredChildren.length > 0) {
              obj.children = filteredChildren;
              return true;
            }
            return false;
          });
        };
        objects = filterSelected(objects);
      }
      
      console.log('Scene tree: Final filtered objects:', objects.length);
      setSceneObjects(objects);
      lastBuildRef.current = currentState;
      
    } catch (error) {
      console.error('Scene tree: Error building objects:', error);
      setSceneObjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly]);

  // Debounced rebuild with longer delay to prevent flickering
  useEffect(() => {
    if (buildTimeoutRef.current) {
      clearTimeout(buildTimeoutRef.current);
    }

    buildTimeoutRef.current = setTimeout(() => {
      buildSceneObjectsStable();
    }, 500); // Increased delay to prevent rapid rebuilds

    return () => {
      if (buildTimeoutRef.current) {
        clearTimeout(buildTimeoutRef.current);
      }
    };
  }, [buildSceneObjectsStable]);

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
      
      // Force rebuild after deletion
      lastBuildRef.current = null;
      buildSceneObjectsStable();
    }
  }, [scene, buildSceneObjectsStable]);

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
