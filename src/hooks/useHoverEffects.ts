
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { createYellowOutline } from './utils/outlineEffects';

export const useHoverEffects = () => {
  const hoverOutlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyHoverEffect = useCallback((object: THREE.Object3D, hovered: boolean) => {
    const hoverOutlineMap = hoverOutlineMapRef.current;

    if (hovered) {
      // Create yellow outline if not already created for this object
      if (!hoverOutlineMap.has(object)) {
        const outline = createYellowOutline(object);
        if (outline) {
          hoverOutlineMap.set(object, outline);
          object.parent?.add(outline);
        }
      }
    } else {
      // Remove outline for this object
      const outline = hoverOutlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        hoverOutlineMap.delete(object);
      }
    }
  }, []);

  return { applyHoverEffect };
};
