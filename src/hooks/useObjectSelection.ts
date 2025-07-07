
import { useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

export const useObjectSelection = () => {
  const { selectObject, selectedObjects, clearSelection, toggleSelection } = useSelectionContext();

  // Helper function to create consistent IDs
  const createObjectId = (object: THREE.Object3D): string => {
    if (object.userData.isPrimitive) return `primitive_${object.uuid}`;
    if (object.userData.isPoint) return `point_${object.uuid}`;
    if (object.userData.isMeasurementGroup) return `measurement_${object.uuid}`;
    return `object_${object.uuid}`;
  };

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null, isMultiSelect = false) => {
    if (object) {
      const objectId = createObjectId(object);
      
      const sceneObject: SceneObject = {
        id: objectId,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.userData.isPrimitive ? 'primitive' : 
              object.userData.isPoint ? 'point' :
              object.userData.isMeasurementGroup ? 'measurement' : 'mesh',
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      
      if (isMultiSelect) {
        toggleSelection(sceneObject);
      } else {
        selectObject(sceneObject);
      }
    } else if (!isMultiSelect) {
      clearSelection();
    }
  }, [selectObject, clearSelection, toggleSelection]);

  return {
    selectedObjects,
    clearSelection,
    handleObjectSelect
  };
};
