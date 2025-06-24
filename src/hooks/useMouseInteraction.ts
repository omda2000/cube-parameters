
import { useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  box: THREE.Mesh | null,
  transformControls: any,
  isSelected: boolean,
  setIsSelected: (selected: boolean) => void,
  transformMode: 'translate' | 'rotate' | 'scale'
) => {
  useEffect(() => {
    if (!renderer || !camera || !box) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(box);

      // Find the label div in the box's children
      const nameLabel = box.children.find(child => child instanceof CSS2DObject) as CSS2DObject;
      if (nameLabel && nameLabel.element) {
        const nameDiv = nameLabel.element as HTMLElement;
        if (intersects.length > 0) {
          nameDiv.style.visibility = 'visible';
        } else {
          nameDiv.style.visibility = 'hidden';
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(box);

      if (intersects.length > 0) {
        setIsSelected(!isSelected);
        if (!isSelected && transformControls) {
          transformControls.attach(box);
          transformControls.setMode(transformMode);
        } else if (transformControls) {
          transformControls.detach();
        }
      } else {
        setIsSelected(false);
        if (transformControls) {
          transformControls.detach();
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    return () => {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
    };
  }, [renderer, camera, box, transformControls, isSelected, setIsSelected, transformMode]);
};
