
import { useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

export const useObjectSelection = () => {
  const { selectObject, selectMultipleObjects, selectedObjects, clearSelection } = useSelectionContext();

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null, addToSelection = false) => {
    if (object) {
      const sceneObject: SceneObject = {
        id: object.userData.isPrimitive ? `primitive_${object.uuid}` : 
            object.userData.isPoint ? `point_${object.uuid}` :
            object.userData.isMeasurementGroup ? `measurement_${object.uuid}` :
            `object_${object.uuid}`,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.userData.isPrimitive ? 'primitive' : 
              object.userData.isPoint ? 'point' :
              object.userData.isMeasurementGroup ? 'measurement' : 'mesh',
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      
      if (addToSelection) {
        selectMultipleObjects(sceneObject, true);
      } else {
        selectObject(sceneObject);
      }
    } else if (!addToSelection) {
      clearSelection();
    }
  }, [selectObject, selectMultipleObjects, clearSelection]);

  return {
    selectedObjects,
    selectedObject: selectedObjects.length > 0 ? selectedObjects[0] : null,
    clearSelection,
    handleObjectSelect
  };
};
