
import { useMemo, useCallback } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

// Helper function to generate consistent object IDs
const generateObjectId = (object: THREE.Object3D): string => {
  if (object.userData.isPrimitive) {
    return `primitive_${object.uuid}`;
  } else if (object.userData.isPoint) {
    return `point_${object.uuid}`;
  } else if (object.userData.isMeasurementGroup) {
    return `measurement_${object.uuid}`;
  } else if (object instanceof THREE.Group) {
    return `group_${object.uuid}`;
  } else if (object instanceof THREE.Mesh) {
    return `mesh_${object.uuid}`;
  } else if (object instanceof THREE.Light) {
    return `light_${object.uuid}`;
  } else if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
    return `env_${object.uuid}`;
  }
  return `object_${object.uuid}`;
};

export const useObjectSelection = () => {
  const { selectObject, selectedObjects, clearSelection, toggleSelection } = useSelectionContext();

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useCallback((object: THREE.Object3D | null, isMultiSelect = false) => {
    if (object) {
      const objectId = generateObjectId(object);
      
      // Check if object is already selected to prevent unnecessary updates
      const isAlreadySelected = selectedObjects.some(obj => obj.id === objectId || obj.object === object);
      
      const sceneObject: SceneObject = {
        id: objectId,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.userData.isPrimitive ? 'primitive' : 
              object.userData.isPoint ? 'point' :
              object.userData.isMeasurementGroup ? 'measurement' : 
              object instanceof THREE.Group ? 'group' :
              object instanceof THREE.Mesh ? 'mesh' :
              object instanceof THREE.Light ? 'light' :
              (object.type === 'GridHelper' || object.type === 'AxesHelper') ? 'environment' : 'mesh',
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      
      if (isMultiSelect) {
        // Only toggle if not already in the exact state we want
        if (!isAlreadySelected) {
          toggleSelection(sceneObject);
        }
      } else {
        // Only select if not already the sole selection
        if (selectedObjects.length !== 1 || !isAlreadySelected) {
          selectObject(sceneObject);
        }
      }
    } else if (!isMultiSelect) {
      // Only clear if there are objects selected
      if (selectedObjects.length > 0) {
        clearSelection();
      }
    }
  }, [selectObject, clearSelection, toggleSelection, selectedObjects]);

  // Memoize the selection state to prevent unnecessary re-renders
  const selectionState = useMemo(() => ({
    selectedObjects,
    hasSelection: selectedObjects.length > 0,
    selectionCount: selectedObjects.length
  }), [selectedObjects]);

  return {
    ...selectionState,
    clearSelection,
    handleObjectSelect
  };
};
