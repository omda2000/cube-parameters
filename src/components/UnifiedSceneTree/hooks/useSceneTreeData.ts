
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
  
  // Track state to prevent unnecessary rebuilds
  const lastBuildRef = useRef<{
    sceneChildrenCount: number;
    modelsCount: number;
    showPrimitives: boolean;
    searchQuery: string;
    showSelectedOnly: boolean;
    timestamp: number;
  } | null>(null);
  
  const buildTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buildSceneObjectsStable = useCallback(() => {
    if (!scene) {
      console.log('Scene tree data: No scene available');
      setSceneObjects([]);
      setIsLoading(false);
      return;
    }

    const currentState = {
      sceneChildrenCount: scene.children.length,
      modelsCount: loadedModels.length,
      showPrimitives,
      searchQuery,
      showSelectedOnly,
      timestamp: Date.now()
    };

    // Only rebuild if there's a meaningful change (not just timestamp)
    if (lastBuildRef.current &&
        lastBuildRef.current.sceneChildrenCount === currentState.sceneChildrenCount &&
        lastBuildRef.current.modelsCount === currentState.modelsCount &&
        lastBuildRef.current.showPrimitives === currentState.showPrimitives &&
        lastBuildRef.current.searchQuery === currentState.searchQuery &&
        lastBuildRef.current.showSelectedOnly === currentState.showSelectedOnly &&
        (currentState.timestamp - lastBuildRef.current.timestamp) < 200) {
      console.log('Scene tree data: Skipping rebuild, no significant changes');
      return;
    }

    console.log('Scene tree data: Building objects, scene children:', currentState.sceneChildrenCount);
    console.log('Scene tree data: Scene children details:', scene.children.map(child => ({ 
      name: child.name, 
      type: child.type, 
      visible: child.visible,
      isPrimitive: child.userData.isPrimitive 
    })));
    
    setIsLoading(true);

    // Use a small delay to batch updates
    if (buildTimeoutRef.current) {
      clearTimeout(buildTimeoutRef.current);
    }

    buildTimeoutRef.current = setTimeout(() => {
      try {
        let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
        
        console.log('Scene tree data: Initial objects built:', objects.length);
        
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
        
        console.log('Scene tree data: Final filtered objects:', objects.length);
        console.log('Scene tree data: Final objects details:', objects.map(obj => ({ name: obj.name, type: obj.type })));
        
        setSceneObjects(objects);
        lastBuildRef.current = currentState;
        
      } catch (error) {
        console.error('Scene tree data: Error building objects:', error);
        setSceneObjects([]);
      } finally {
        setIsLoading(false);
      }
    }, 100); // Short delay to batch rapid changes

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
