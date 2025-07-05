
import { useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

export const useObjectSelection = () => {
  const { selectObject, selectedObject, clearSelection } = useSelectionContext();

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null) => {
    if (object) {
      const sceneObject: SceneObject = {
        id: object.userData.isPrimitive ? `primitive_${object.uuid}` : 
            object.userData.isPoint ? `point_${object.uuid}` : `object_${object.uuid}`,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.userData.isPrimitive ? 'primitive' : 
              object.userData.isPoint ? 'point' : 'mesh',
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      selectObject(sceneObject);
    } else {
      clearSelection();
    }
  }, [selectObject, clearSelection]);

  return {
    selectedObject,
    clearSelection,
    handleObjectSelect
  };
};
