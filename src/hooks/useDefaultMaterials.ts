
import { useEffect } from 'react';
import * as THREE from 'three';
import type { LoadedModel } from '../types/model';

export const useDefaultMaterials = (scene: THREE.Scene | null, loadedModels: LoadedModel[]) => {
  useEffect(() => {
    if (!scene) return;

    const defaultMaterial = new THREE.MeshPhongMaterial({
      color: 0x808080, // Grey color
      shininess: 30,
      transparent: false,
      side: THREE.DoubleSide
    });

    const applyDefaultMaterial = (object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        // Check if material is missing or is a basic material without color
        if (!object.material || 
            (object.material instanceof THREE.MeshBasicMaterial && !object.material.color)) {
          object.material = defaultMaterial.clone();
        }
        
        // Handle array of materials
        if (Array.isArray(object.material)) {
          object.material = object.material.map(mat => {
            if (!mat || (mat instanceof THREE.MeshBasicMaterial && !mat.color)) {
              return defaultMaterial.clone();
            }
            return mat;
          });
        }
      }
      
      // Recursively apply to children
      object.children.forEach(applyDefaultMaterial);
    };

    // Apply to all scene objects
    scene.traverse(applyDefaultMaterial);
    
    // Cleanup function
    return () => {
      defaultMaterial.dispose();
    };
  }, [scene, loadedModels]);
};
