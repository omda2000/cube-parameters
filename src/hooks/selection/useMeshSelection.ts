
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { createBlueOutline, createBoundingBoxOutline } from '../utils/outlineEffects';

export const useMeshSelection = () => {
  const outlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());
  const boundingBoxMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyMeshSelection = useCallback((object: THREE.Object3D, selected: boolean) => {
    const outlineMap = outlineMapRef.current;
    const boundingBoxMap = boundingBoxMapRef.current;

    console.log('Applying mesh selection effect:', { object: object.name || object.type, selected });

    if (selected) {
      // Create blue outline if not already created for this object
      if (!outlineMap.has(object)) {
        const outline = createBlueOutline(object);
        if (outline) {
          outlineMap.set(object, outline);
          if (object.parent) {
            object.parent.add(outline);
            console.log('Blue selection outline added to scene');
          }
        }
      }

      // Create bounding box if not already created for this object
      if (!boundingBoxMap.has(object)) {
        const boundingBox = createBoundingBoxOutline(object);
        if (boundingBox) {
          boundingBoxMap.set(object, boundingBox);
          if (object.parent) {
            object.parent.add(boundingBox);
            console.log('Cyan bounding box added to scene');
          }
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
        console.log('Blue selection outline removed from scene');
      }

      // Remove bounding box for this object
      const boundingBox = boundingBoxMap.get(object);
      if (boundingBox) {
        boundingBox.parent?.remove(boundingBox);
        boundingBox.geometry.dispose();
        (boundingBox.material as THREE.Material).dispose();
        boundingBoxMap.delete(object);
        console.log('Cyan bounding box removed from scene');
      }
    }
  }, []);

  // Cleanup function to remove all selection effects
  const cleanupMeshSelection = useCallback(() => {
    const outlineMap = outlineMapRef.current;
    const boundingBoxMap = boundingBoxMapRef.current;
    
    outlineMap.forEach((outline, object) => {
      outline.parent?.remove(outline);
      outline.geometry.dispose();
      (outline.material as THREE.Material).dispose();
    });
    outlineMap.clear();

    boundingBoxMap.forEach((boundingBox, object) => {
      boundingBox.parent?.remove(boundingBox);
      boundingBox.geometry.dispose();
      (boundingBox.material as THREE.Material).dispose();
    });
    boundingBoxMap.clear();
    
    console.log('All mesh selection effects cleaned up');
  }, []);

  return { applyMeshSelection, cleanupMeshSelection };
};
