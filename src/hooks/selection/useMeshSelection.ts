
import { useRef } from 'react';
import * as THREE from 'three';
import { createBlueOutline } from '../utils/outlineEffects';
import { applyMaterialOverlay, restoreOriginalMaterials } from '../utils/materialEffects';

export const useMeshSelection = () => {
  const originalMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const outlineRef = useRef<THREE.LineSegments | null>(null);

  const applyMeshSelection = (object: THREE.Object3D, selected: boolean, overlayMaterial: THREE.Material) => {
    const originalMaterials = originalMaterialsRef.current;

    if (selected) {
      // Create blue outline
      const outline = createBlueOutline(object);
      if (outline) {
        outlineRef.current = outline;
        object.parent?.add(outline);
      }
      
      // Apply red overlay
      applyMaterialOverlay(object, overlayMaterial, originalMaterials);
    } else {
      // Remove outline
      if (outlineRef.current) {
        outlineRef.current.parent?.remove(outlineRef.current);
        outlineRef.current.geometry.dispose();
        (outlineRef.current.material as THREE.Material).dispose();
        outlineRef.current = null;
      }
      
      // Restore original materials
      restoreOriginalMaterials(object, originalMaterials);
    }
  };

  return { applyMeshSelection };
};
