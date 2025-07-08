
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
        // Handle both direct meshes and groups containing meshes
        object.traverse((child) => {
          if (child instanceof THREE.Mesh && !outlineMap.has(child)) {
            const outline = createBlueOutline(child);
            if (outline) {
              outlineMap.set(child, outline);
              // Add outline to the scene, not just the parent
              if (child.parent) {
                child.parent.add(outline);
              }
            }
          }
        });
        
        // Also handle the object itself if it's a mesh
        if (object instanceof THREE.Mesh) {
          const outline = createBlueOutline(object);
          if (outline) {
            outlineMap.set(object, outline);
            if (object.parent) {
              object.parent.add(outline);
            }
          }
        }
      }
    } else {
      // Remove outline for this object and all its children
      const objectsToRemove: THREE.Object3D[] = [];
      
      object.traverse((child) => {
        if (outlineMap.has(child)) {
          objectsToRemove.push(child);
        }
      });
      
      // Also check the object itself
      if (outlineMap.has(object)) {
        objectsToRemove.push(object);
      }
      
      objectsToRemove.forEach((obj) => {
        const outline = outlineMap.get(obj);
        if (outline) {
          outline.parent?.remove(outline);
          outline.geometry.dispose();
          (outline.material as THREE.Material).dispose();
          outlineMap.delete(obj);
        }
      });
    }
  };

  return { applyMeshSelection };
};
