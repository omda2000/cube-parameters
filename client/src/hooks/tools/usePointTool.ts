
import { useCallback } from 'react';
import * as THREE from 'three';
import { getIntersectionPoint } from '../utils/raycastUtils';
import { createPointMarker } from '../utils/objectCreators';

export const usePointTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onObjectSelect?: (object: THREE.Object3D | null) => void
) => {
  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    const intersectionPoint = getIntersectionPoint(event.clientX, event.clientY, renderer, camera, scene);
    
    if (intersectionPoint) {
      const pointMarker = createPointMarker(intersectionPoint, scene);
      
      if (onPointCreate) {
        onPointCreate({ 
          x: intersectionPoint.x, 
          y: intersectionPoint.y, 
          z: intersectionPoint.z 
        });
      }
      
      if (onObjectSelect) {
        onObjectSelect(pointMarker);
      }
    }
  }, [renderer, camera, scene, onPointCreate, onObjectSelect]);

  return { handleClick };
};
