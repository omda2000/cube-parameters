import { useRef } from 'react';
import * as THREE from 'three';
import { createHoverOutline } from '../utils/outlineEffects';

export const useHoverEffects = () => {
  const hoverOutlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyHoverEffect = (object: THREE.Object3D, hovered: boolean) => {
    const hoverOutlineMap = hoverOutlineMapRef.current;

    if (hovered) {
      // Create hover outline if not already created for this object
      if (!hoverOutlineMap.has(object)) {
        const hoverOutline = createHoverOutline(object);
        if (hoverOutline) {
          hoverOutlineMap.set(object, hoverOutline);
          object.parent?.add(hoverOutline);
        }
      }
    } else {
      // Remove hover outline for this object
      const hoverOutline = hoverOutlineMap.get(object);
      if (hoverOutline) {
        hoverOutline.parent?.remove(hoverOutline);
        hoverOutline.geometry.dispose();
        (hoverOutline.material as THREE.Material).dispose();
        hoverOutlineMap.delete(object);
      }
    }
  };

  return { applyHoverEffect };
};