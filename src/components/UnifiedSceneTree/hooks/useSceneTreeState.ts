
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
    forceRebuild,
    setSceneObjects
  } = useSceneTreeData(scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly);

  const {
    expandedNodes,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete
  } = useSceneTreeActions(scene, forceRebuild);

  // Enhanced logging for debugging
  useEffect(() => {
    console.log('SceneTreeState: State changed -', {
      hasScene: !!scene,
      sceneChildrenCount: scene?.children.length || 0,
      loadedModelsCount: loadedModels.length,
      showPrimitives,
      searchQuery: searchQuery.trim(),
      showSelectedOnly,
      selectedObjectsCount: selectedObjects.length,
      sceneObjectsCount: sceneObjects.length,
      isLoading
    });
  }, [scene, loadedModels.length, showPrimitives, searchQuery, showSelectedOnly, selectedObjects.length, sceneObjects.length, isLoading]);

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
