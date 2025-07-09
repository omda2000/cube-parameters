
import { useEffect } from 'react';
import * as THREE from 'three';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import type { LoadedModel } from '../../../types/model';
import { useSceneTreeData } from './useSceneTreeData';
import { useSceneTreeActions } from './useSceneTreeActions';

export const useSceneTreeState = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  searchQuery: string = '',
  showSelectedOnly: boolean = false
) => {
  const { selectedObjects, clearSelection } = useSelectionContext();
  
  const {
    sceneObjects,
    isLoading,
    buildSceneObjectsStable,
    buildTimeoutRef,
    lastBuildRef,
    setSceneObjects
  } = useSceneTreeData(scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly);

  const forceRebuild = () => {
    console.log('Scene tree state: Force rebuild triggered');
    lastBuildRef.current = null;
    buildSceneObjectsStable();
  };

  const {
    expandedNodes,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete
  } = useSceneTreeActions(scene, forceRebuild);

  // Initial build and rebuild on major changes only
  useEffect(() => {
    console.log('Scene tree state: Effect triggered, building objects');
    buildSceneObjectsStable();
  }, [scene, loadedModels.length, showPrimitives, buildSceneObjectsStable]);

  // Separate effect for search and filter changes with debouncing
  useEffect(() => {
    if (buildTimeoutRef.current) {
      clearTimeout(buildTimeoutRef.current);
    }

    buildTimeoutRef.current = setTimeout(() => {
      console.log('Scene tree state: Search/filter changed, rebuilding');
      buildSceneObjectsStable();
    }, 300); // Longer delay for search/filter changes

    return () => {
      if (buildTimeoutRef.current) {
        clearTimeout(buildTimeoutRef.current);
      }
    };
  }, [searchQuery, showSelectedOnly, buildSceneObjectsStable]);

  const wrappedToggleVisibility = (sceneObject: any) => {
    toggleVisibility(sceneObject, setSceneObjects);
  };

  return {
    expandedNodes,
    sceneObjects,
    selectedObjects,
    isLoading,
    toggleExpanded,
    toggleVisibility: wrappedToggleVisibility,
    handleObjectSelect,
    handleDelete,
    clearSelection
  };
};
