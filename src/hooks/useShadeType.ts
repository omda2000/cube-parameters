
import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export type ShadeType = 'shaded' | 'wireframe' | 'hidden' | 'shaded-with-edges';

export const useShadeType = (sceneRef: React.RefObject<THREE.Scene | null>) => {
  const [shadeType, setShadeType] = useState<ShadeType>('shaded');

  const applyShadeTypeToScene = useCallback((type: ShadeType) => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh && !object.userData.isHelper) {
        const mesh = object as THREE.Mesh;
        
        // Store original material if not already stored
        if (!mesh.userData.originalMaterial && mesh.material) {
          mesh.userData.originalMaterial = Array.isArray(mesh.material) 
            ? mesh.material.map(mat => mat.clone())
            : mesh.material.clone();
        }

        // Clean up previous edge helpers
        if (mesh.userData.edgesHelper) {
          mesh.remove(mesh.userData.edgesHelper);
          mesh.userData.edgesHelper.geometry.dispose();
          (mesh.userData.edgesHelper.material as THREE.Material).dispose();
          delete mesh.userData.edgesHelper;
        }

        switch (type) {
          case 'shaded':
            // Restore original material
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            mesh.visible = true;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                if ('wireframe' in mat) {
                  (mat as any).wireframe = false;
                }
              });
            } else if ('wireframe' in mesh.material) {
              (mesh.material as any).wireframe = false;
            }
            break;

          case 'wireframe':
            // Restore material first, then enable wireframe
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            mesh.visible = true;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                if ('wireframe' in mat) {
                  (mat as any).wireframe = true;
                }
              });
            } else if ('wireframe' in mesh.material) {
              (mesh.material as any).wireframe = true;
            }
            break;

          case 'hidden':
            // Simply hide the mesh
            mesh.visible = false;
            break;

          case 'shaded-with-edges':
            // Restore original material
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            mesh.visible = true;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                if ('wireframe' in mat) {
                  (mat as any).wireframe = false;
                }
              });
            } else if ('wireframe' in mesh.material) {
              (mesh.material as any).wireframe = false;
            }
            
            // Add wireframe edges
            if (mesh.geometry) {
              const edges = new THREE.EdgesGeometry(mesh.geometry);
              const edgesMaterial = new THREE.LineBasicMaterial({ 
                color: 0x000000,
                linewidth: 1
              });
              const edgesHelper = new THREE.LineSegments(edges, edgesMaterial);
              edgesHelper.userData.isHelper = true;
              mesh.add(edgesHelper);
              mesh.userData.edgesHelper = edgesHelper;
            }
            break;
        }
      }
    });
  }, [sceneRef]);

  useEffect(() => {
    applyShadeTypeToScene(shadeType);
  }, [shadeType, applyShadeTypeToScene]);

  const setShadeTypeWithEffect = useCallback((type: ShadeType) => {
    setShadeType(type);
    // Apply immediately for responsive feedback
    setTimeout(() => applyShadeTypeToScene(type), 0);
  }, [applyShadeTypeToScene]);

  return {
    shadeType,
    setShadeType: setShadeTypeWithEffect
  };
};
