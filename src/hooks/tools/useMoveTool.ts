import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const useMoveTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  controls: OrbitControls | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void
) => {
  const transformRef = useRef<TransformControls | null>(null);

  // Initialize TransformControls when renderer, camera and scene are ready
  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const control = new TransformControls(camera, renderer.domElement);
    control.setMode('translate');
    control.addEventListener('dragging-changed', (e) => {
      if (controls) controls.enabled = !e.value;
    });
    scene.add(control);
    transformRef.current = control;

    return () => {
      control.dispose();
      scene.remove(control);
      transformRef.current = null;
    };
  }, [renderer, camera, scene, controls]);

  // Attach object on click for moving
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!renderer || !camera || !scene || !transformRef.current || event.button !== 0) {
        return;
      }

      const { raycaster, mouse, dispose } = createRaycaster();
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objects = getIntersectableObjects(scene);
      const intersects = raycaster.intersectObjects(objects, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        transformRef.current.attach(obj);
        if (onObjectSelect) onObjectSelect(obj);
      } else {
        transformRef.current.detach();
        if (onObjectSelect) onObjectSelect(null);
      }

      dispose();
    },
    [renderer, camera, scene, onObjectSelect]
  );

  const cleanup = useCallback(() => {
    transformRef.current?.detach();
  }, []);

  return { handleClick, cleanup };
};
