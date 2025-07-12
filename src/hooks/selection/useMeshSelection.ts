
import { useRef } from 'react';
import * as THREE from 'three';
import { createSelectionEffects } from '../utils/outlineEffects';

export const useMeshSelection = () => {
  const outlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());
  const boundingBoxMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyMeshSelection = (object: THREE.Object3D, selected: boolean) => {
    const outlineMap = outlineMapRef.current;
    const boundingBoxMap = boundingBoxMapRef.current;

    if (selected) {
      // Create selection effects if not already created for this object
      if (!outlineMap.has(object)) {
        const { outline, boundingBox } = createSelectionEffects(object);
        
        if (outline) {
          outlineMap.set(object, outline);
          object.parent?.add(outline);
        }
        
        if (boundingBox) {
          boundingBoxMap.set(object, boundingBox);
          object.parent?.add(boundingBox);
        }
      }
    } else {
      // Remove outline for this object
      const outline = outlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        outlineMap.delete(object);
      }

      // Remove bounding box for this object
      const boundingBox = boundingBoxMap.get(object);
      if (boundingBox) {
        boundingBox.parent?.remove(boundingBox);
        boundingBox.geometry.dispose();
        (boundingBox.material as THREE.Material).dispose();
        boundingBoxMap.delete(object);
      }
    }
  };

  return { applyMeshSelection };
};
