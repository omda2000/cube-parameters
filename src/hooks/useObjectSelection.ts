
import { useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

export const useObjectSelection = () => {
  const { selectObject, selectedObject, clearSelection } = useSelectionContext();

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null) => {
    console.log('useObjectSelection: handleObjectSelect called with:', object?.uuid || 'null');
    
    if (object) {
      let objectId: string;
      let objectType: SceneObject['type'];
      let objectName: string;

      // Determine object type and ID
      if (object.userData.isPrimitive) {
        objectId = `primitive_${object.uuid}`;
        objectType = 'primitive';
        objectName = object.name || 'Box Primitive';
      } else if (object.userData.isPoint) {
        objectId = `point_${object.uuid}`;
        objectType = 'point';
        objectName = object.name || `Point (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`;
      } else if (object.userData.isMeasurementGroup) {
        objectId = `measurement_${object.uuid}`;
        objectType = 'measurement';
        const distance = object.userData.measurementData?.distance || 0;
        objectName = object.name || `Measurement (${distance.toFixed(3)} units)`;
      } else {
        objectId = `object_${object.uuid}`;
        objectType = 'mesh';
        objectName = object.name || `${object.type}_${object.uuid.slice(0, 8)}`;
      }

      const sceneObject: SceneObject = {
        id: objectId,
        name: objectName,
        type: objectType,
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      
      console.log('useObjectSelection: Created SceneObject:', sceneObject);
      selectObject(sceneObject);
    } else {
      console.log('useObjectSelection: Clearing selection');
      clearSelection();
    }
  }, [selectObject, clearSelection]);

  return {
    selectedObject,
    clearSelection,
    handleObjectSelect
  };
};
