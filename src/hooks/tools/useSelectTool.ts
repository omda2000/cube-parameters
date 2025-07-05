
import { useCallback } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const useSelectTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null, addToSelection?: boolean) => void
) => {
  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

    // Handle multiple selection with Ctrl+Right Click
    const isMultiSelect = (event.ctrlKey || event.metaKey) && event.button === 2;
    const isRegularSelect = event.button === 0;

    if (!isMultiSelect && !isRegularSelect) return;

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
      
      onObjectSelect(targetObject, isMultiSelect);
    } else if (onObjectSelect && !isMultiSelect) {
      // Only clear selection on regular click, not on Ctrl+Right click
      onObjectSelect(null);
    }
  }, [renderer, camera, scene, onObjectSelect]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    // Prevent default context menu when Ctrl is held
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
  }, []);

  return { handleClick, handleContextMenu };
};
