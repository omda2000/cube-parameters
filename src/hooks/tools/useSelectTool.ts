
import { useCallback } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const useSelectTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null, isMultiSelect?: boolean) => void
) => {
  const findSelectableObject = useCallback((object: THREE.Object3D): THREE.Object3D => {
    // If clicked on a child of a measurement group, select the group
    if (object.parent && object.parent.userData.isMeasurementGroup) {
      return object.parent;
    }
    
    // If clicked on part of a loaded model, find the model root
    if (object.userData.isPartOfLoadedModel && object.userData.loadedModelRoot) {
      return object.userData.loadedModelRoot;
    }
    
    // If this object is itself a loaded model root, select it
    if (object.userData.isLoadedModel || (object.parent && object.parent.userData.isLoadedModel)) {
      // Walk up to find the actual loaded model root
      let current = object;
      while (current.parent && !current.userData.isLoadedModel) {
        current = current.parent;
        if (current.userData.isLoadedModel) {
          return current;
        }
      }
    }
    
    return object;
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    // Prevent event propagation to avoid conflicts with OrbitControls
    event.stopPropagation();
    event.preventDefault();

    const isCtrlClick = event.ctrlKey || event.metaKey;
    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);
    
    if (intersects.length > 0 && onObjectSelect) {
      const hitObject = intersects[0].object;
      const targetObject = findSelectableObject(hitObject);
      
      console.log('Object selected:', targetObject.name || targetObject.type, 'from hit:', hitObject.name || hitObject.type);
      onObjectSelect(targetObject, isCtrlClick);
    } else if (onObjectSelect && !isCtrlClick) {
      console.log('Selection cleared');
      onObjectSelect(null, false);
    }
  }, [renderer, camera, scene, onObjectSelect, findSelectableObject]);

  const handleTouch = useCallback((event: TouchEvent) => {
    if (!renderer || !camera || !scene || event.touches.length !== 1) return;

    event.preventDefault();
    event.stopPropagation();
    
    const touch = event.touches[0];
    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);
    
    if (intersects.length > 0 && onObjectSelect) {
      const hitObject = intersects[0].object;
      const targetObject = findSelectableObject(hitObject);
      
      console.log('Object selected via touch:', targetObject.name || targetObject.type, 'from hit:', hitObject.name || hitObject.type);
      onObjectSelect(targetObject, false); // No multi-select on touch
    } else if (onObjectSelect) {
      console.log('Selection cleared via touch');
      onObjectSelect(null, false);
    }
  }, [renderer, camera, scene, onObjectSelect, findSelectableObject]);

  return { handleClick, handleTouch };
};
