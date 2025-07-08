
import { useRef } from 'react';
import * as THREE from 'three';
import { createBlueOutline } from '../utils/outlineEffects';

export const useMeshSelection = () => {
  const outlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyMeshSelection = (object: THREE.Object3D, selected: boolean) => {
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
      
      // Ensure material properties are preserved during selection
      object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial) {
              // Restore any stored properties
              if (material.userData.originalProperties) {
                const props = material.userData.originalProperties;
                material.opacity = props.opacity;
                material.transparent = props.transparent;
                material.needsUpdate = true;
              }
            }
          });
        }
      });
    } else {
      // Remove outline for this object
      const outline = outlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        outlineMap.delete(object);
      }

      // Restore original material properties when deselecting
      object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial && material.userData.originalProperties) {
              const props = material.userData.originalProperties;
              material.opacity = props.opacity;
              material.transparent = props.transparent;
              material.needsUpdate = true;
            }
          });
        }
      });
    }
  };

  return { applyMeshSelection };
};
