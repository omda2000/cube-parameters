
import { useRef } from 'react';
import * as THREE from 'three';
import { createPointSelectionEffect } from '../utils/outlineEffects';

export const usePointSelection = () => {
  const pointOutlineMapRef = useRef<Map<THREE.Object3D, THREE.Mesh>>(new Map());

  const applyPointSelection = (object: THREE.Object3D, selected: boolean) => {
    const outlineMap = pointOutlineMapRef.current;

    if (selected) {
      if (!outlineMap.has(object)) {
        const pointOutline = createPointSelectionEffect(object);
        if (pointOutline) {
          outlineMap.set(object, pointOutline);
          object.parent?.add(pointOutline);
        }
      }
    } else {
      const outline = outlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        outlineMap.delete(object);
      }
    }
  };

  return { applyPointSelection };
};
