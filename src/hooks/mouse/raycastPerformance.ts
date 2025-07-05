
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';

export const performRaycast = (
  x: number,
  y: number,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene
) => {
  const { raycaster, mouse, dispose } = createRaycaster();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersectableObjects = getIntersectableObjects(scene);
  const intersects = raycaster.intersectObjects(intersectableObjects, true);

  const result = intersects.length > 0 ? intersects[0].object : null;
  dispose();
  
  return result;
};
