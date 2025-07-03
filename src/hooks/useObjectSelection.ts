
import { useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

export const useObjectSelection = () => {
  const { selectObject, selectedObject, selectedObjects, clearSelection } = useSelectionContext();

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null, addToSelection = false) => {
    if (object) {
      // Check if it's a measurement group and extract measurement data
      let measurementData = undefined;
      let objectType = 'mesh';
      
      if (object.userData.isMeasurementGroup && object.userData.measurementData) {
        measurementData = object.userData.measurementData;
        objectType = 'measurement';
      } else if (object.userData.isPrimitive) {
        objectType = 'primitive';
      } else if (object.userData.isPoint) {
        objectType = 'point';
      }

      const sceneObject: SceneObject = {
        id: object.userData.isPrimitive ? `primitive_${object.uuid}` : 
            object.userData.isPoint ? `point_${object.uuid}` :
            object.userData.isMeasurementGroup ? `measurement_${object.uuid}` : `object_${object.uuid}`,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: objectType as any,
        object: object,
        children: [],
        visible: object.visible,
        selected: true,
        measurementData
      };
      selectObject(sceneObject, addToSelection);
    } else if (!addToSelection) {
      clearSelection();
    }
  }, [selectObject, clearSelection]);

  return {
    selectedObject,
    selectedObjects,
    clearSelection,
    handleObjectSelect
  };
};
