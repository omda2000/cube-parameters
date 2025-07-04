
import { useCallback } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const useSelectTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void
) => {
  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);
    
    if (intersects.length > 0 && onObjectSelect) {
      let targetObject = intersects[0].object;
      
      // If clicked on a child of a measurement group, select the group
      if (targetObject.parent && targetObject.parent.userData.isMeasurementGroup) {
        targetObject = targetObject.parent;
      }
      
      onObjectSelect(targetObject);
    } else if (onObjectSelect) {
      onObjectSelect(null);
    }
  }, [renderer, camera, scene, onObjectSelect]);

  return { handleClick };
};
