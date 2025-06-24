
import { useEffect } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  transformControls: TransformControls | null,
  isSelected: boolean,
  setIsSelected: (selected: boolean) => void,
  transformMode: 'translate' | 'rotate' | 'scale'
) => {
  useEffect(() => {
    if (!renderer || !camera || !targetObject || !transformControls) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      // Prevent interaction when transform controls are being dragged
      if (transformControls.dragging) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      // Check intersection with the target object
      const intersects = raycaster.intersectObject(targetObject, true);
      
      if (intersects.length > 0) {
        if (!isSelected) {
          setIsSelected(true);
          transformControls.attach(targetObject);
          
          // Store the original position to prevent drift
          const originalPosition = targetObject.position.clone();
          const originalRotation = targetObject.rotation.clone();
          const originalScale = targetObject.scale.clone();
          
          // Ensure object stability
          targetObject.position.copy(originalPosition);
          targetObject.rotation.copy(originalRotation);
          targetObject.scale.copy(originalScale);
          targetObject.updateMatrixWorld(true);
        }
      } else {
        setIsSelected(false);
        transformControls.detach();
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (!targetObject) return;
      
      // Double-click to focus on object (zoom to fit)
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(targetObject, true);
      
      if (intersects.length > 0) {
        // Calculate bounding box and adjust camera
        const box = new THREE.Box3().setFromObject(targetObject);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;
        
        // Smooth camera animation would go here
        camera.position.copy(center);
        camera.position.z += distance;
        camera.lookAt(center);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('dblclick', handleDoubleClick);

    return () => {
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [renderer, camera, targetObject, transformControls, setIsSelected, isSelected]);

  // Handle attachment/detachment more carefully
  useEffect(() => {
    if (!transformControls || !targetObject) return;

    if (isSelected) {
      // Store original transform before attaching
      const originalMatrix = targetObject.matrixWorld.clone();
      transformControls.attach(targetObject);
      transformControls.setMode(transformMode);
      
      // Restore matrix to prevent jumps
      targetObject.matrixWorld.copy(originalMatrix);
      targetObject.matrix.copy(targetObject.matrixWorld);
    } else {
      transformControls.detach();
    }
  }, [transformControls, targetObject, isSelected, transformMode]);
};
