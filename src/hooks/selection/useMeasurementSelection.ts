
import { useRef } from 'react';
import * as THREE from 'three';
import { createMeasurementSelectionEffect } from '../utils/outlineEffects';

export const useMeasurementSelection = () => {
  const measurementOutlineRef = useRef<THREE.Group | null>(null);

  const applyMeasurementSelection = (object: THREE.Object3D, selected: boolean) => {
    if (!(object instanceof THREE.Group)) return;

    if (selected) {
      const measurementOutline = createMeasurementSelectionEffect(object);
      if (measurementOutline) {
        measurementOutlineRef.current = measurementOutline;
        object.parent?.add(measurementOutline);
      }
    } else {
      if (measurementOutlineRef.current) {
        measurementOutlineRef.current.parent?.remove(measurementOutlineRef.current);
        // Dispose all children materials and geometries
        measurementOutlineRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          } else if (child instanceof THREE.Line) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        measurementOutlineRef.current = null;
      }
    }
  };

  return { applyMeasurementSelection };
};
