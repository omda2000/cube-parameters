
import { useEffect } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      // Check intersection with the target object
      const intersects = raycaster.intersectObject(targetObject, true);
      
      if (intersects.length > 0) {
        setIsSelected(true);
        transformControls.attach(targetObject);
      } else {
        setIsSelected(false);
        transformControls.detach();
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      renderer.domElement.removeEventListener('click', handleClick);
    };
  }, [renderer, camera, targetObject, transformControls, setIsSelected]);

  useEffect(() => {
    if (!transformControls || !targetObject) return;

    if (isSelected) {
      transformControls.attach(targetObject);
      transformControls.setMode(transformMode);
    } else {
      transformControls.detach();
    }
  }, [transformControls, targetObject, isSelected, transformMode]);
};
