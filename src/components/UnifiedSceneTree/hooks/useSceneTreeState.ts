
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
