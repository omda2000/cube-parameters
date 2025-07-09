
import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';
import { buildSceneObjects } from '../utils/sceneObjectBuilder';

export const useSceneTreeData = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[],
  searchQuery: string = '',
  showSelectedOnly: boolean = false
) => {
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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

  return {
    sceneObjects,
    isLoading,
    buildSceneObjectsStable,
    buildTimeoutRef,
    lastBuildRef,
    setSceneObjects
  };
};
