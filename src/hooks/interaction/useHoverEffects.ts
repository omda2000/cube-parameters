
import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { MaterialManager } from '../utils/materialManager';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const useHoverEffects = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onObjectDataChange?: (data: any) => void,
  extractObjectData?: (object: THREE.Object3D) => any
) => {
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const materialManagerRef = useRef<MaterialManager | null>(null);

  const initializeMaterialManager = useCallback(() => {
    if (!materialManagerRef.current) {
      materialManagerRef.current = new MaterialManager();
    }
  }, []);

  const performRaycast = useCallback((x: number, y: number) => {
    if (!renderer || !camera || !scene) return;

    const { raycaster, mouse, dispose } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);

    if (intersects.length > 0) {
      const newHoveredObject = intersects[0].object;

      if (hoveredObject !== newHoveredObject) {
        if (hoveredObject && materialManagerRef.current) {
          materialManagerRef.current.setHoverEffect(hoveredObject, false);
        }

        if (materialManagerRef.current) {
          materialManagerRef.current.setHoverEffect(newHoveredObject, true);
        }
        setHoveredObject(newHoveredObject);
        
        if (onObjectDataChange && extractObjectData) {
          onObjectDataChange(extractObjectData(newHoveredObject));
        }
      }
    } else {
      if (hoveredObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(hoveredObject, false);
        setHoveredObject(null);
        if (onObjectDataChange) {
          onObjectDataChange(null);
        }
      }
    }

    dispose();
  }, [renderer, camera, scene, hoveredObject, onObjectDataChange, extractObjectData]);

  const clearHoverEffects = useCallback(() => {
    if (hoveredObject && materialManagerRef.current) {
      materialManagerRef.current.setHoverEffect(hoveredObject, false);
      setHoveredObject(null);
      if (onObjectDataChange) {
        onObjectDataChange(null);
      }
    }
  }, [hoveredObject, onObjectDataChange]);

  const disposeMaterialManager = useCallback(() => {
    if (materialManagerRef.current) {
      materialManagerRef.current.dispose();
    }
  }, []);

  return {
    hoveredObject,
    initializeMaterialManager,
    performRaycast,
    clearHoverEffects,
    disposeMaterialManager
  };
};
