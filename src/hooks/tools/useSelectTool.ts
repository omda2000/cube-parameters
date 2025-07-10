
import { useCallback } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const useSelectTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null, isMultiSelect?: boolean) => void
) => {
  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    const isCtrlClick = event.ctrlKey || event.metaKey;
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
      
      console.log('Object selected:', targetObject.name || targetObject.type);
      onObjectSelect(targetObject, isCtrlClick);
    } else if (onObjectSelect && !isCtrlClick) {
      console.log('Selection cleared');
      onObjectSelect(null, false);
    }
  }, [renderer, camera, scene, onObjectSelect]);

  const handleTouch = useCallback((event: TouchEvent) => {
    if (!renderer || !camera || !scene || event.touches.length !== 1) return;

    event.preventDefault(); // Prevent default touch behavior
    
    const touch = event.touches[0];
    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);
    
    if (intersects.length > 0 && onObjectSelect) {
      let targetObject = intersects[0].object;
      
      // If touched on a child of a measurement group, select the group
      if (targetObject.parent && targetObject.parent.userData.isMeasurementGroup) {
        targetObject = targetObject.parent;
      }
      
      console.log('Object selected via touch:', targetObject.name || targetObject.type);
      onObjectSelect(targetObject, false); // No multi-select on touch
    } else if (onObjectSelect) {
      console.log('Selection cleared via touch');
      onObjectSelect(null, false);
    }
  }, [renderer, camera, scene, onObjectSelect]);

  return { handleClick, handleTouch };
};
