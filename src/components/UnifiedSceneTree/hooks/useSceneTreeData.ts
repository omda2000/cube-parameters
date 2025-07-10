
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
  
  // Enhanced stability tracking
  const lastBuildStateRef = useRef<string>('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidObjectsRef = useRef<SceneObject[]>([]);
  
  const createBuildKey = useCallback(() => {
    if (!scene) return 'no-scene';
    
    // Create more stable build key that accounts for loading states
    const sceneChildrenInfo = scene.children
      .filter(child => !child.userData?.isHelper || child.type === 'GridHelper' || child.type === 'AxesHelper')
      .map(child => {
        const isStable = child.userData?.isStable || false;
        const isLoading = child.userData?.isLoading || false;
        return `${child.name || 'unnamed'}_${child.type}_${child.visible}_${isStable}_${isLoading}`;
      })
      .join('|');
    
    return [
      scene.children.length,
      loadedModels.length,
      showPrimitives,
      searchQuery.trim(),
      showSelectedOnly,
      sceneChildrenInfo
    ].join('_');
  }, [scene, loadedModels.length, showPrimitives, searchQuery, showSelectedOnly]);

  const buildSceneObjectsStable = useCallback(() => {
    console.log('SceneTreeData: Starting stable build process');
    
    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce the actual build to prevent rapid rebuilds
    debounceTimeoutRef.current = setTimeout(() => {
      if (!scene) {
        console.log('SceneTreeData: No scene available, using last valid objects');
        if (lastValidObjectsRef.current.length === 0) {
          setSceneObjects([]);
          setIsLoading(false);
        }
        return;
      }

      const currentBuildKey = createBuildKey();
      
      // Skip rebuild if nothing has actually changed
      if (lastBuildStateRef.current === currentBuildKey) {
        console.log('SceneTreeData: Skipping rebuild, no changes detected');
        return;
      }

      console.log('SceneTreeData: Building objects for scene with', scene.children.length, 'children');
      
      // Check if any objects are still loading
      const hasLoadingObjects = scene.children.some(child => child.userData?.isLoading);
      if (hasLoadingObjects) {
        console.log('SceneTreeData: Objects still loading, using cached version');
        return;
      }

      setIsLoading(true);

      try {
        // Build objects synchronously
        let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
        
        console.log('SceneTreeData: Built', objects.length, 'initial objects');
        
        // Apply search filter if needed
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
          console.log('SceneTreeData: After search filter:', objects.length, 'objects');
        }
        
        // Apply selection filter if needed
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
          console.log('SceneTreeData: After selection filter:', objects.length, 'objects');
        }
        
        console.log('SceneTreeData: Final objects ready:', objects.map(obj => ({ name: obj.name, type: obj.type })));
        
        // Update state and cache
        setSceneObjects(objects);
        lastValidObjectsRef.current = objects;
        lastBuildStateRef.current = currentBuildKey;
        
      } catch (error) {
        console.error('SceneTreeData: Error building objects:', error);
        // Use last valid objects on error
        if (lastValidObjectsRef.current.length > 0) {
          setSceneObjects(lastValidObjectsRef.current);
        } else {
          setSceneObjects([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce to prevent rapid rebuilds during loading
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, createBuildKey]);

  // Force rebuild for external calls (like after deletion)
  const forceRebuild = useCallback(() => {
    console.log('SceneTreeData: Force rebuild requested');
    lastBuildStateRef.current = '';
    buildSceneObjectsStable();
  }, [buildSceneObjectsStable]);

  // Effect for scene/model changes
  useEffect(() => {
    console.log('SceneTreeData: Dependencies changed, scheduling rebuild');
    buildSceneObjectsStable();
  }, [
    scene,
    loadedModels.length,
    showPrimitives,
    selectedObjects,
    searchQuery,
    showSelectedOnly
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    sceneObjects,
    isLoading,
    buildSceneObjectsStable,
    forceRebuild,
    setSceneObjects
  };
};
