
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
  
  // Simplified stability tracking without complex timeouts
  const lastBuildStateRef = useRef<string>('');
  const lastValidObjectsRef = useRef<SceneObject[]>([]);
  
  const createBuildKey = useCallback(() => {
    if (!scene) return 'no-scene';
    
    // Create comprehensive build key
    const sceneChildrenInfo = scene.children
      .filter(child => !child.userData?.isHelper || child.type === 'GridHelper' || child.type === 'AxesHelper')
      .map(child => {
        const isStable = child.userData?.isStable !== false; // Default to stable
        const isLoadedModel = child.userData?.isLoadedModel || false;
        const modelName = child.userData?.modelName || '';
        return `${child.name || 'unnamed'}_${child.type}_${child.visible}_${isStable}_${isLoadedModel}_${modelName}`;
      })
      .join('|');
    
    const loadedModelsInfo = loadedModels.map(model => 
      `${model.id}_${model.name}_${model.object.children.length}`
    ).join('|');
    
    return [
      scene.children.length,
      loadedModels.length,
      showPrimitives,
      searchQuery.trim(),
      showSelectedOnly,
      sceneChildrenInfo,
      loadedModelsInfo
    ].join('_');
  }, [scene, loadedModels, showPrimitives, searchQuery, showSelectedOnly]);

  const buildSceneObjectsStable = useCallback(() => {
    console.log('SceneTreeData: Starting build process');
    
    if (!scene) {
      console.log('SceneTreeData: No scene available');
      if (lastValidObjectsRef.current.length === 0) {
        setSceneObjects([]);
        setIsLoading(false);
      }
      return;
    }

    const currentBuildKey = createBuildKey();
    
    // Skip rebuild if nothing has changed
    if (lastBuildStateRef.current === currentBuildKey) {
      console.log('SceneTreeData: No changes detected, skipping rebuild');
      return;
    }

    console.log('SceneTreeData: Building objects for scene with', scene.children.length, 'children');
    console.log('SceneTreeData: Loaded models:', loadedModels.length);
    
    setIsLoading(true);

    try {
      // Build objects synchronously
      console.log('SceneTreeData: Building scene objects...');
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
      
      console.log('SceneTreeData: Final objects ready:', objects.map(obj => ({ 
        name: obj.name, 
        type: obj.type,
        childrenCount: obj.children.length 
      })));
      
      // Update state and cache immediately
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
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, createBuildKey]);

  // Force rebuild for external calls
  const forceRebuild = useCallback(() => {
    console.log('SceneTreeData: Force rebuild requested');
    lastBuildStateRef.current = '';
    buildSceneObjectsStable();
  }, [buildSceneObjectsStable]);

  // Effect for scene/model changes - immediate response
  useEffect(() => {
    console.log('SceneTreeData: Dependencies changed, building objects');
    buildSceneObjectsStable();
  }, [
    scene,
    loadedModels.length,
    // Track actual loaded model changes
    ...loadedModels.map(model => model.id),
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
