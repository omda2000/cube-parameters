
import { useRef } from 'react';
import * as THREE from 'three';
import { createMeasurementSelectionEffect } from '../utils/outlineEffects';

export const useMeasurementSelection = () => {
  const measurementOutlineMapRef = useRef<Map<THREE.Object3D, THREE.Group>>(new Map());

  const applyMeasurementSelection = (object: THREE.Object3D, selected: boolean) => {
    if (!(object instanceof THREE.Group)) return;

    const outlineMap = measurementOutlineMapRef.current;

    if (selected) {
      if ((object as any).userData.label) {
        (object as any).userData.label.visible = true;
      }
      if (!outlineMap.has(object)) {
        const measurementOutline = createMeasurementSelectionEffect(object);
        if (measurementOutline) {
          outlineMap.set(object, measurementOutline);
          object.parent?.add(measurementOutline);
        }
      }
    } else {
      const outline = outlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        // Dispose all children materials and geometries
        outline.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          } else if (child instanceof THREE.Line) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        outlineMap.delete(object);
      }
      if ((object as any).userData.label) {
        (object as any).userData.label.visible = false;
      }
    }
  };

  return { applyMeasurementSelection };
};
