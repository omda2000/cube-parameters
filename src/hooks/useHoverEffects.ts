
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { createYellowOutline } from './utils/outlineEffects';

export const useHoverEffects = () => {
  const hoverOutlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyHoverEffect = useCallback((object: THREE.Object3D, hovered: boolean) => {
    const hoverOutlineMap = hoverOutlineMapRef.current;
    
    console.log('Applying hover effect:', { object: object.name || object.type, hovered });

    if (hovered) {
      // Create yellow outline if not already created for this object
      if (!hoverOutlineMap.has(object)) {
        const outline = createYellowOutline(object);
        if (outline) {
          hoverOutlineMap.set(object, outline);
          // Add to scene instead of parent to ensure visibility
          if (object.parent) {
            object.parent.add(outline);
            console.log('Yellow hover outline added to scene');
          }
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
        console.log('Yellow hover outline removed from scene');
      }
    }
  }, []);

  // Cleanup function to remove all hover effects
  const cleanupHoverEffects = useCallback(() => {
    const hoverOutlineMap = hoverOutlineMapRef.current;
    hoverOutlineMap.forEach((outline, object) => {
      outline.parent?.remove(outline);
      outline.geometry.dispose();
      (outline.material as THREE.Material).dispose();
    });
    hoverOutlineMap.clear();
    console.log('All hover effects cleaned up');
  }, []);

  return { applyHoverEffect, cleanupHoverEffects };
};
