
import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

interface MaterialProperties {
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
}

export const useMaterialProperties = (selectedObjects: SceneObject[]) => {
  const [materialProps, setMaterialProps] = useState<MaterialProperties>({
    color: '#808080',
    metalness: 0.1,
    roughness: 0.6,
    envMapIntensity: 0.5
  });

  // Extract material properties from the first selected object
  useEffect(() => {
    if (selectedObjects.length > 0 && selectedObjects[0].object) {
      const object = selectedObjects[0].object;
      
      if (object instanceof THREE.Mesh && object.material) {
        const material = Array.isArray(object.material) ? object.material[0] : object.material;
        
        if (material instanceof THREE.MeshStandardMaterial) {
          setMaterialProps({
            color: `#${material.color.getHexString()}`,
            metalness: material.metalness,
            roughness: material.roughness,
            envMapIntensity: material.envMapIntensity || 0.5
          });
        }
      }
    }
  }, [selectedObjects]);

  // Update material properties on selected objects
  const updateMaterialProperty = useCallback((property: keyof MaterialProperties, value: any) => {
    setMaterialProps(prev => ({ ...prev, [property]: value }));

    selectedObjects.forEach(selectedObject => {
      if (selectedObject.object instanceof THREE.Mesh && selectedObject.object.material) {
        const materials = Array.isArray(selectedObject.object.material) 
          ? selectedObject.object.material 
          : [selectedObject.object.material];

        materials.forEach(material => {
          if (material instanceof THREE.MeshStandardMaterial) {
            switch (property) {
              case 'color':
                material.color.setHex(parseInt(value.replace('#', ''), 16));
                break;
              case 'metalness':
                material.metalness = value;
                break;
              case 'roughness':
                material.roughness = value;
                break;
              case 'envMapIntensity':
                material.envMapIntensity = value;
                break;
            }
            material.needsUpdate = true;
          }
        });
      }
    });
  }, [selectedObjects]);

  return {
    materialProps,
    updateMaterialProperty
  };
};
