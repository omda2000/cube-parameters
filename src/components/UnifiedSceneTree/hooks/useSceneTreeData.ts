
import { useState, useRef, useCallback, useEffect } from 'react';
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
  
  // Track last successful build to prevent unnecessary rebuilds
  const lastBuildStateRef = useRef<string>('');
  
  // Create a stable build key to detect when we actually need to rebuild
  const createBuildKey = useCallback(() => {
    if (!scene) return 'no-scene';
    
    return [
      scene.children.length,
      loadedModels.length,
      showPrimitives,
      searchQuery.trim(),
      showSelectedOnly,
      // Include a hash of scene children names for better change detection
      scene.children.map(child => `${child.name || 'unnamed'}_${child.type}_${child.visible}`).join('|')
    ].join('_');
  }, [scene, loadedModels.length, showPrimitives, searchQuery, showSelectedOnly]);

  const buildSceneObjectsStable = useCallback(() => {
    console.log('SceneTreeData: Starting buildSceneObjectsStable');
    
    if (!scene) {
      console.log('SceneTreeData: No scene available, clearing objects');
      setSceneObjects([]);
      setIsLoading(false);
      return;
    }

    const currentBuildKey = createBuildKey();
    
    // Skip rebuild if nothing has actually changed
    if (lastBuildStateRef.current === currentBuildKey) {
      console.log('SceneTreeData: Skipping rebuild, no changes detected');
      return;
    }

    console.log('SceneTreeData: Building objects for scene with', scene.children.length, 'children');
    console.log('SceneTreeData: Scene children:', scene.children.map(child => ({
      name: child.name || 'unnamed',
      type: child.type,
      visible: child.visible,
      isPrimitive: child.userData?.isPrimitive || false
    })));

    setIsLoading(true);

    try {
      // Build objects synchronously - no timeouts
      let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
      
      console.log('SceneTreeData: Built', objects.length, 'initial objects');
      
      // Apply search filter if needed
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const filterBySearch = (objs: SceneObject[]): SceneObject[] => {
          return objs.filter(obj => {
            // Check if object name matches
            if (obj.name.toLowerCase().includes(query)) return true;
            
            // Recursively check children
            const filteredChildren = filterBySearch(obj.children);
            if (filteredChildren.length > 0) {
              obj.children = filteredChildren;
              return true;
            }
            return false;
          });
        };
        objects = filterBySearch(objects);
        console.log('SceneTreeData: After search filter:', objects.length, 'objects');
      }
      
      // Apply selection filter if needed
      if (showSelectedOnly && selectedObjects.length > 0) {
        const selectedIds = new Set(selectedObjects.map(obj => obj.id));
        const filterBySelection = (objs: SceneObject[]): SceneObject[] => {
          return objs.filter(obj => {
            // Check if object is selected
            if (selectedIds.has(obj.id)) return true;
            
            // Recursively check children
            const filteredChildren = filterBySelection(obj.children);
            if (filteredChildren.length > 0) {
              obj.children = filteredChildren;
              return true;
            }
            return false;
          });
        };
        objects = filterBySelection(objects);
        console.log('SceneTreeData: After selection filter:', objects.length, 'objects');
      }
      
      console.log('SceneTreeData: Final objects ready:', objects.map(obj => ({ name: obj.name, type: obj.type })));
      
      // Update state and mark this build as successful
      setSceneObjects(objects);
      lastBuildStateRef.current = currentBuildKey;
      
    } catch (error) {
      console.error('SceneTreeData: Error building objects:', error);
      setSceneObjects([]);
    } finally {
      // Always clear loading state
      setIsLoading(false);
    }
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, createBuildKey]);

  // Force rebuild for external calls (like after deletion)
  const forceRebuild = useCallback(() => {
    console.log('SceneTreeData: Force rebuild requested');
    lastBuildStateRef.current = '';
    buildSceneObjectsStable();
  }, [buildSceneObjectsStable]);

  // Effect for scene/model changes - these should trigger immediate rebuilds
  useEffect(() => {
    console.log('SceneTreeData: Scene or models changed, rebuilding');
    buildSceneObjectsStable();
  }, [
    scene,
    loadedModels.length,
    showPrimitives,
    selectedObjects,
    searchQuery,
    showSelectedOnly
  ]);

  return {
    sceneObjects,
    isLoading,
    buildSceneObjectsStable,
    forceRebuild,
    setSceneObjects
  };
};
