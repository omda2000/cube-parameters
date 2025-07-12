
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { createBlueOutline, createBoundingBoxOutline } from '../utils/outlineEffects';

export const useMeshSelection = () => {
  const outlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());
  const boundingBoxMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyMeshSelection = useCallback((object: THREE.Object3D, selected: boolean) => {
    const outlineMap = outlineMapRef.current;
    const boundingBoxMap = boundingBoxMapRef.current;

    console.log('Applying mesh selection effect:', { 
      object: object.name || object.type, 
      selected,
      objectType: object.constructor.name,
      hasGeometry: object instanceof THREE.Mesh ? !!object.geometry : false
    });

    if (selected) {
      // Find the actual mesh to apply effects to
      let targetMesh: THREE.Mesh | null = null;
      
      if (object instanceof THREE.Mesh) {
        targetMesh = object;
      } else if (object instanceof THREE.Group) {
        // Find the first mesh in the group
        object.traverse((child) => {
          if (child instanceof THREE.Mesh && !targetMesh) {
            targetMesh = child;
          }
        });
      }

      if (targetMesh) {
        console.log('Target mesh found for selection effects:', targetMesh.name || targetMesh.type);
        
        // Create blue outline if not already created for this object
        if (!outlineMap.has(object)) {
          const outline = createBlueOutline(targetMesh);
          if (outline) {
            outlineMap.set(object, outline);
            // Add to scene root for better visibility
            let scene = targetMesh.parent;
            while (scene && scene.parent && scene.type !== 'Scene') {
              scene = scene.parent as THREE.Scene;
            }
            if (scene && scene.type === 'Scene') {
              scene.add(outline);
              console.log('Blue selection outline added to scene');
            } else {
              targetMesh.parent?.add(outline);
              console.log('Blue selection outline added to parent');
            }
          }
        }

        // Create bounding box if not already created for this object
        if (!boundingBoxMap.has(object)) {
          const boundingBox = createBoundingBoxOutline(targetMesh);
          if (boundingBox) {
            boundingBoxMap.set(object, boundingBox);
            // Add to scene root for better visibility
            let scene = targetMesh.parent;
            while (scene && scene.parent && scene.type !== 'Scene') {
              scene = scene.parent as THREE.Scene;
            }
            if (scene && scene.type === 'Scene') {
              scene.add(boundingBox);
              console.log('Cyan bounding box added to scene');
            } else {
              targetMesh.parent?.add(boundingBox);
              console.log('Cyan bounding box added to parent');
            }
          }
        }
      } else {
        console.warn('No mesh found in object for selection effects');
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
