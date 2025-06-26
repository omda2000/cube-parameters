
import { useRef } from 'react';
import * as THREE from 'three';
import { createPointSelectionEffect } from '../utils/outlineEffects';

export const usePointSelection = () => {
  const pointOutlineRef = useRef<THREE.Mesh | null>(null);

  const applyPointSelection = (object: THREE.Object3D, selected: boolean) => {
    if (selected) {
      const pointOutline = createPointSelectionEffect(object);
      if (pointOutline) {
        pointOutlineRef.current = pointOutline;
        object.parent?.add(pointOutline);
      }
    } else {
      if (pointOutlineRef.current) {
        pointOutlineRef.current.parent?.remove(pointOutlineRef.current);
        pointOutlineRef.current.geometry.dispose();
        (pointOutlineRef.current.material as THREE.Material).dispose();
        pointOutlineRef.current = null;
      }
    }
  };

  return { applyPointSelection };
};
