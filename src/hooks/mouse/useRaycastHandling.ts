
import { useCallback } from 'react';
import * as THREE from 'three';
import { performRaycast } from './raycastPerformance';
import { MaterialManager } from '../utils/materialManager';

interface UseRaycastHandlingProps {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  hoveredObject: THREE.Object3D | null;
  setHoveredObject: (object: THREE.Object3D | null) => void;
  materialManager: MaterialManager | null;
  extractObjectData: (object: THREE.Object3D) => any;
  setObjectData: (data: any) => void;
}

export const useRaycastHandling = ({
  renderer,
  camera,
  scene,
  hoveredObject,
  setHoveredObject,
  materialManager,
  extractObjectData,
  setObjectData
}: UseRaycastHandlingProps) => {
  const handleRaycastHover = useCallback((x: number, y: number) => {
    if (!renderer || !camera || !scene || !materialManager) return;

    try {
      const intersectedObject = performRaycast(x, y, renderer, camera, scene);

      if (intersectedObject !== hoveredObject) {
        if (hoveredObject) {
          materialManager.setHoverEffect(hoveredObject, false);
        }

        if (intersectedObject) {
          materialManager.setHoverEffect(intersectedObject, true);
          const data = extractObjectData(intersectedObject);
          setObjectData(data);
        } else {
          setObjectData(null);
        }

        setHoveredObject(intersectedObject);
      }
    } catch (error) {
      console.warn('Raycast handling error:', error);
      setObjectData(null);
      setHoveredObject(null);
    }
  }, [renderer, camera, scene, hoveredObject, materialManager, extractObjectData, setObjectData, setHoveredObject]);

  return { handleRaycastHover };
};
