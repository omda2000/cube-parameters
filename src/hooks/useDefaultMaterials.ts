
import { useEffect } from 'react';
import * as THREE from 'three';
import type { LoadedModel } from '../types/model';

export const useDefaultMaterials = (scene: THREE.Scene | null, loadedModels: LoadedModel[]) => {
  useEffect(() => {
    if (!scene) return;

    // Create a high-quality PBR default material with all channels
    const defaultMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080, // Grey diffuse color
      metalness: 0.1, // Slight metallic property
      roughness: 0.6, // Balanced roughness for realistic appearance
      transparent: false,
      side: THREE.DoubleSide,
      // Enable shadow casting and receiving
      shadowSide: THREE.DoubleSide,
      // Environment map will be applied automatically if available
      envMapIntensity: 0.5,
      // Enable proper lighting response
      flatShading: false,
      // Add slight emissive for better visibility
      emissive: 0x111111,
      emissiveIntensity: 0.05
    });

    const applyDefaultMaterial = (object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        // Check if material is missing or needs replacement
        const needsDefaultMaterial = !object.material || 
          (object.material instanceof THREE.MeshBasicMaterial && 
           (!object.material.color || object.material.color.getHex() === 0x000000));

        if (needsDefaultMaterial) {
          object.material = defaultMaterial.clone();
          // Ensure the mesh can cast and receive shadows
          object.castShadow = true;
          object.receiveShadow = true;
        }
        
        // Handle array of materials
        if (Array.isArray(object.material)) {
          object.material = object.material.map(mat => {
            if (!mat || (mat instanceof THREE.MeshBasicMaterial && 
                (!mat.color || mat.color.getHex() === 0x000000))) {
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
