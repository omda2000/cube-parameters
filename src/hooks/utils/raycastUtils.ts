
import * as THREE from 'three';

export const createRaycaster = () => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  return { raycaster, mouse };
};

export const getIntersectionPoint = (
  clientX: number,
  clientY: number,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene
): THREE.Vector3 | null => {
  const { raycaster, mouse } = createRaycaster();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  const intersectableObjects: THREE.Object3D[] = [];
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.visible) {
      intersectableObjects.push(object);
    }
  });

  const intersects = raycaster.intersectObjects(intersectableObjects, true);
  return intersects.length > 0 ? intersects[0].point : null;
};

export const getIntersectableObjects = (scene: THREE.Scene) => {
  const intersectableObjects: THREE.Object3D[] = [];
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.visible && !object.userData.isHelper) {
      intersectableObjects.push(object);
    }
    if ((object.userData.isPoint || object.userData.isMeasurementGroup) && object.visible) {
      intersectableObjects.push(object);
    }
  });
  return intersectableObjects;
};
