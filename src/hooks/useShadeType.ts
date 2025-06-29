
import { useState, useEffect } from 'react';
import * as THREE from 'three';

export type ShadeType = 'shaded' | 'wireframe' | 'hidden' | 'shaded-with-edges';

export const useShadeType = (sceneRef: React.RefObject<THREE.Scene | null>) => {
  const [shadeType, setShadeType] = useState<ShadeType>('shaded');

  const applyShadeTypeToScene = (type: ShadeType) => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const mesh = object as THREE.Mesh;
        
        // Store original material if not already stored
        if (!mesh.userData.originalMaterial && mesh.material) {
          mesh.userData.originalMaterial = Array.isArray(mesh.material) 
            ? mesh.material.map(mat => mat.clone())
            : mesh.material.clone();
        }

        switch (type) {
          case 'shaded':
            // Restore original material and remove edge helpers
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            if (mesh.userData.edgesHelper) {
              mesh.remove(mesh.userData.edgesHelper);
              mesh.userData.edgesHelper.geometry.dispose();
              (mesh.userData.edgesHelper.material as THREE.Material).dispose();
              delete mesh.userData.edgesHelper;
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
            // Restore material and remove edge helpers
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            if (mesh.userData.edgesHelper) {
              mesh.remove(mesh.userData.edgesHelper);
              mesh.userData.edgesHelper.geometry.dispose();
              (mesh.userData.edgesHelper.material as THREE.Material).dispose();
              delete mesh.userData.edgesHelper;
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
            // Restore material and remove edge helpers then hide
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            if (mesh.userData.edgesHelper) {
              mesh.remove(mesh.userData.edgesHelper);
              mesh.userData.edgesHelper.geometry.dispose();
              (mesh.userData.edgesHelper.material as THREE.Material).dispose();
              delete mesh.userData.edgesHelper;
            }
            mesh.visible = false;
            break;

          case 'shaded-with-edges':
            // Restore original material first
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
            if (!mesh.userData.edgesHelper && mesh.geometry) {
              const edges = new THREE.EdgesGeometry(mesh.geometry);
              const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
              const edgesHelper = new THREE.LineSegments(edges, edgesMaterial);
              mesh.add(edgesHelper);
              mesh.userData.edgesHelper = edgesHelper;
            }
            break;
        }
      }
    });
  };

  useEffect(() => {
    applyShadeTypeToScene(shadeType);
  }, [shadeType, sceneRef]);

  return {
    shadeType,
    setShadeType: (type: ShadeType) => {
      setShadeType(type);
      applyShadeTypeToScene(type);
    }
  };
};
