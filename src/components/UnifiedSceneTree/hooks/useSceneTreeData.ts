
import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';
import { buildSceneObjects } from '../utils/sceneObjectBuilder';
import { useStableLoadingState } from './useStableLoadingState';

export const useSceneTreeData = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[],
  searchQuery: string = '',
  showSelectedOnly: boolean = false
) => {
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const { isLoading, isStable, startLoading, finishLoading } = useStableLoadingState({
    minLoadingDuration: 300,
    debounceDelay: 100
  });
  
  // Track build state to prevent unnecessary rebuilds
  const lastBuildStateRef = useRef<string>('');
  const isRebuildingRef = useRef(false);
  
  // Create a stable build key
  const createBuildKey = useCallback(() => {
    if (!scene) return 'no-scene';
    
    const sceneKey = scene.children.map(child => 
      `${child.name || 'unnamed'}_${child.type}_${child.visible}_${child.userData?.isPrimitive || false}`
    ).join('|');
    
    return [
      scene.children.length,
      loadedModels.length,
      showPrimitives,
      searchQuery.trim(),
      showSelectedOnly,
      sceneKey
    ].join('_');
  }, [scene, loadedModels.length, showPrimitives, searchQuery, showSelectedOnly]);

  const buildSceneObjectsStable = useCallback(async () => {
    console.log('SceneTreeData: Starting stable build process');
    
    if (!scene) {
      console.log('SceneTreeData: No scene available');
      setSceneObjects([]);
      return;
    }

    const currentBuildKey = createBuildKey();
    
    // Skip rebuild if nothing changed and not during FBX loading
    if (lastBuildStateRef.current === currentBuildKey && !isRebuildingRef.current) {
      console.log('SceneTreeData: Skipping rebuild - no changes detected');
      return;
    }

    // Prevent concurrent rebuilds
    if (isRebuildingRef.current) {
      console.log('SceneTreeData: Rebuild already in progress, skipping');
      return;
    }

    isRebuildingRef.current = true;
    startLoading();

    try {
      console.log('SceneTreeData: Building objects for scene with', scene.children.length, 'children');
      
      // Add small delay to batch rapid changes during FBX loading
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Build objects synchronously but allow UI updates
      let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
      
      console.log('SceneTreeData: Built', objects.length, 'objects before filtering');
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const filterBySearch = (objs: SceneObject[]): SceneObject[] => {
          return objs.filter(obj => {
            if (obj.name.toLowerCase().includes(query)) return true;
            
            const filteredChildren = filterBySearch(obj.children);
            if (filteredChildren.length > 0) {
              obj.children = filteredChildren;
              return true;
            }
            return false;
          });
        };
        objects = filterBySearch(objects);
      }
      
      // Apply selection filter
      if (showSelectedOnly && selectedObjects.length > 0) {
        const selectedIds = new Set(selectedObjects.map(obj => obj.id));
        const filterBySelection = (objs: SceneObject[]): SceneObject[] => {
          return objs.filter(obj => {
            if (selectedIds.has(obj.id)) return true;
            
            const filteredChildren = filterBySelection(obj.children);
            if (filteredChildren.length > 0) {
              obj.children = filteredChildren;
              return true;
            }
            return false;
          });
        };
        objects = filterBySelection(objects);
      }
      
      console.log('SceneTreeData: Final objects count:', objects.length);
      
      // Update state only if objects actually changed
      setSceneObjects(prevObjects => {
        const objectsChanged = JSON.stringify(objects.map(o => ({ id: o.id, name: o.name, type: o.type }))) !== 
                              JSON.stringify(prevObjects.map(o => ({ id: o.id, name: o.name, type: o.type })));
        
        if (objectsChanged) {
          console.log('SceneTreeData: Objects changed, updating state');
          return objects;
        }
        
        console.log('SceneTreeData: Objects unchanged, keeping previous state');
        return prevObjects;
      });
      
      lastBuildStateRef.current = currentBuildKey;
      
    } catch (error) {
      console.error('SceneTreeData: Error building objects:', error);
      setSceneObjects([]);
    } finally {
      isRebuildingRef.current = false;
      finishLoading();
    }
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, createBuildKey, startLoading, finishLoading]);

  // Force rebuild for external calls
  const forceRebuild = useCallback(() => {
    console.log('SceneTreeData: Force rebuild requested');
    lastBuildStateRef.current = '';
    isRebuildingRef.current = false;
    buildSceneObjectsStable();
  }, [buildSceneObjectsStable]);

  // Effect for scene/model changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('SceneTreeData: Scene change detected, rebuilding');
      buildSceneObjectsStable();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [buildSceneObjectsStable]);

  return {
    sceneObjects,
    isLoading,
    isStable,
    buildSceneObjectsStable,
    forceRebuild,
    setSceneObjects
  };
};
