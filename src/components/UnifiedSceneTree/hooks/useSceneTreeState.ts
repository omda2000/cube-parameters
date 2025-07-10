
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

  // Reduced logging for better performance
  useEffect(() => {
    console.log('SceneTreeState: State summary -', {
      hasScene: !!scene,
      sceneChildrenCount: scene?.children.length || 0,
      loadedModelsCount: loadedModels.length,
      sceneObjectsCount: sceneObjects.length,
      isLoading
    });
  }, [scene?.children.length, loadedModels.length, sceneObjects.length, isLoading]);

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
