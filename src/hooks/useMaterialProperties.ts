
import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

interface MaterialProperties {
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  opacity: number;
}

export const useMaterialProperties = (selectedObjects: SceneObject[]) => {
  const [materialProps, setMaterialProps] = useState<MaterialProperties>({
    color: '#808080',
    metalness: 0.1,
    roughness: 0.6,
    envMapIntensity: 0.5,
    opacity: 1.0
  });

  // Extract material properties from the first selected object
  useEffect(() => {
    if (selectedObjects.length > 0 && selectedObjects[0].object) {
      const object = selectedObjects[0].object;
      
      const extractMaterialProps = (obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh && obj.material) {
          const material = Array.isArray(obj.material) ? obj.material[0] : obj.material;
          
          if (material instanceof THREE.MeshStandardMaterial) {
            setMaterialProps({
              color: `#${material.color.getHexString()}`,
              metalness: material.metalness,
              roughness: material.roughness,
              envMapIntensity: material.envMapIntensity || 0.5,
              opacity: material.opacity
            });
            return true;
          }
        }
        return false;
      };

      // Try to extract from object itself first, then traverse children
      if (!extractMaterialProps(object)) {
        object.traverse((child) => {
          if (extractMaterialProps(child)) {
            return; // Stop traversing once we find a material
          }
        });
      }
    } else {
      // Reset to default when no objects selected
      setMaterialProps({
        color: '#808080',
        metalness: 0.1,
        roughness: 0.6,
        envMapIntensity: 0.5,
        opacity: 1.0
      });
    }
  }, [selectedObjects]);

  // Update material properties on selected objects
  const updateMaterialProperty = useCallback((property: keyof MaterialProperties, value: any) => {
    // Don't proceed if no objects are selected
    if (selectedObjects.length === 0) return;

    // Update local state immediately for responsive UI
    setMaterialProps(prev => ({ ...prev, [property]: value }));

    // Apply to all selected objects
    selectedObjects.forEach(selectedObject => {
      if (!selectedObject?.object) return;

      const updateObjectMaterial = (obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh && obj.material) {
          const materials = Array.isArray(obj.material) 
            ? obj.material 
            : [obj.material];

          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial) {
              // Store original properties if not already stored
              if (!material.userData.originalProperties) {
                material.userData.originalProperties = {
                  color: material.color.getHex(),
                  metalness: material.metalness,
                  roughness: material.roughness,
                  envMapIntensity: material.envMapIntensity,
                  opacity: material.opacity,
                  transparent: material.transparent
                };
              }

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
                case 'opacity':
                  material.opacity = value;
                  material.transparent = value < 1.0;
                  // Update stored original properties to reflect user changes
                  material.userData.originalProperties.opacity = value;
                  material.userData.originalProperties.transparent = value < 1.0;
                  break;
              }
              material.needsUpdate = true;
            }
          });
        }
      };

      // Update the object itself and all its children
      updateObjectMaterial(selectedObject.object);
      selectedObject.object.traverse(updateObjectMaterial);
    });
  }, [selectedObjects]);

  return {
    materialProps,
    updateMaterialProperty
  };
};
