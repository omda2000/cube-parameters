
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

interface MaterialProperties {
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  opacity: number;
}

const DEFAULT_MATERIAL_PROPS: MaterialProperties = {
  color: '#808080',
  metalness: 0.1,
  roughness: 0.6,
  envMapIntensity: 0.5,
  opacity: 1.0
};

export const useMaterialProperties = (selectedObjects: SceneObject[]) => {
  const [materialProps, setMaterialProps] = useState<MaterialProperties>(DEFAULT_MATERIAL_PROPS);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSelectedIdRef = useRef<string>('');

  // Memoize selected object ID for stable comparison
  const selectedObjectId = useMemo(() => {
    return selectedObjects.length > 0 ? selectedObjects[0].id : '';
  }, [selectedObjects]);

  // Extract material properties with memoization
  const extractedProps = useMemo(() => {
    if (selectedObjects.length === 0 || !selectedObjects[0].object) {
      return DEFAULT_MATERIAL_PROPS;
    }

    const object = selectedObjects[0].object;
    let extractedMaterial: MaterialProperties | null = null;

    const extractMaterialProps = (obj: THREE.Object3D) => {
      if (extractedMaterial) return true; // Stop if already found
      
      if (obj instanceof THREE.Mesh && obj.material) {
        const material = Array.isArray(obj.material) ? obj.material[0] : obj.material;
        
        if (material instanceof THREE.MeshStandardMaterial) {
          extractedMaterial = {
            color: `#${material.color.getHexString()}`,
            metalness: material.metalness,
            roughness: material.roughness,
            envMapIntensity: material.envMapIntensity || 0.5,
            opacity: material.opacity
          };
          return true;
        }
      }
      return false;
    };

    // Try to extract from object itself first, then traverse children
    if (!extractMaterialProps(object)) {
      object.traverse((child) => {
        extractMaterialProps(child);
      });
    }

    return extractedMaterial || DEFAULT_MATERIAL_PROPS;
  }, [selectedObjects]);

  // Update material properties only when selection changes
  useEffect(() => {
    if (selectedObjectId !== lastSelectedIdRef.current) {
      setMaterialProps(extractedProps);
      lastSelectedIdRef.current = selectedObjectId;
    }
  }, [selectedObjectId, extractedProps]);

  // Debounced material property update
  const updateMaterialProperty = useCallback((property: keyof MaterialProperties, value: any) => {
    if (selectedObjects.length === 0) return;

    // Update local state immediately for responsive UI
    setMaterialProps(prev => ({ ...prev, [property]: value }));

    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce actual material updates
    updateTimeoutRef.current = setTimeout(() => {
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
                    material.userData.originalProperties.opacity = value;
                    material.userData.originalProperties.transparent = value < 1.0;
                    break;
                }
                material.needsUpdate = true;
              }
            });
          }
        };

        updateObjectMaterial(selectedObject.object);
        selectedObject.object.traverse(updateObjectMaterial);
      });
    }, 16); // ~60fps debouncing
  }, [selectedObjects]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    materialProps,
    updateMaterialProperty
  };
};
