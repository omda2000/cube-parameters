
import { useRef } from 'react';
import * as THREE from 'three';
import { createBlueOutline } from '../utils/outlineEffects';
import { applyMaterialOverlay, restoreOriginalMaterials } from '../utils/materialEffects';

export const useMeshSelection = () => {
  const originalMaterialsRef =
    useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const outlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyMeshSelection = (object: THREE.Object3D, selected: boolean, overlayMaterial: THREE.Material) => {
    const originalMaterials = originalMaterialsRef.current;
    const outlineMap = outlineMapRef.current;

    if (selected) {
      // Create blue outline if not already created for this object
      if (!outlineMap.has(object)) {
        const outline = createBlueOutline(object);
        if (outline) {
          outlineMap.set(object, outline);
          object.parent?.add(outline);
        }
      }

      // Apply red overlay
      applyMaterialOverlay(object, overlayMaterial, originalMaterials);
    } else {
      // Remove outline for this object
      const outline = outlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        outlineMap.delete(object);
      }

      // Restore original materials
      restoreOriginalMaterials(object, originalMaterials);
    }
  };

  return { applyMeshSelection };
};
