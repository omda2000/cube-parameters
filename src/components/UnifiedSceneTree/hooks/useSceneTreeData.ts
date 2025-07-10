
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
  const [isActuallyLoading, setIsActuallyLoading] = useState(false);
  
  // Use stable loading state to prevent flickering
  const { isStableLoading, isStableNotLoading } = useStableLoadingState(isActuallyLoading, {
    minLoadingDuration: 300,
    stabilityDelay: 150
  });
  
  // Track last successful build to prevent unnecessary rebuilds
  const lastBuildStateRef = useRef<string>('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  
  // Create a stable build key to detect when we actually need to rebuild
  const createBuildKey = useCallback(() => {
    if (!scene) return 'no-scene';
    
    return [
      scene.children.length,
      loadedModels.length,
      loadedModels.map(m => `${m.id}_${m.name}`).join('|'), // More stable model tracking
      showPrimitives,
      searchQuery.trim(),
      showSelectedOnly,
      scene.children.map(child => `${child.name || 'unnamed'}_${child.type}_${child.visible}_${child.userData?.isLoadedModel || false}`).join('|')
    ].join('_');
  }, [scene, loadedModels, showPrimitives, searchQuery, showSelectedOnly]);

  const buildSceneObjectsStable = useCallback(() => {
    console.log('SceneTreeData: Starting buildSceneObjectsStable');
    
    if (!scene) {
      console.log('SceneTreeData: No scene available, clearing objects');
      setSceneObjects([]);
      setIsActuallyLoading(false);
      return;
    }

    // Prevent concurrent processing
    if (isProcessingRef.current) {
      console.log('SceneTreeData: Already processing, skipping');
      return;
    }

    const currentBuildKey = createBuildKey();
    
    // Skip rebuild if nothing has actually changed
    if (lastBuildStateRef.current === currentBuildKey) {
      console.log('SceneTreeData: Skipping rebuild, no changes detected');
      return;
    }

    console.log('SceneTreeData: Building objects for scene with', scene.children.length, 'children');
    
    isProcessingRef.current = true;
    setIsActuallyLoading(true);

    // Use a small timeout to allow UI to update loading state
    setTimeout(() => {
      try {
        // Build objects synchronously
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
        // Always clear processing and loading state
        isProcessingRef.current = false;
        setIsActuallyLoading(false);
      }
    }, 10);
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, createBuildKey]);

  // Debounced rebuild for high-frequency updates
  const debouncedRebuild = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      buildSceneObjectsStable();
    }, 100);
  }, [buildSceneObjectsStable]);

  // Force rebuild for external calls (like after deletion)
  const forceRebuild = useCallback(() => {
    console.log('SceneTreeData: Force rebuild requested');
    lastBuildStateRef.current = '';
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    buildSceneObjectsStable();
  }, [buildSceneObjectsStable]);

  // Effect for immediate rebuilds on critical changes
  useEffect(() => {
    console.log('SceneTreeData: Critical changes detected, rebuilding');
    buildSceneObjectsStable();
  }, [scene, loadedModels.length]);

  // Effect for debounced rebuilds on secondary changes
  useEffect(() => {
    console.log('SceneTreeData: Secondary changes detected, debounced rebuild');
    debouncedRebuild();
  }, [showPrimitives, selectedObjects.length, searchQuery, showSelectedOnly, debouncedRebuild]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    sceneObjects,
    isLoading: isStableLoading,
    buildSceneObjectsStable,
    forceRebuild,
    setSceneObjects
  };
};
