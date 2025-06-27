
import * as THREE from 'three';
import { ObjectPool } from './ObjectPool';

const objectPool = ObjectPool.getInstance();

export const createRaycaster = () => {
  const raycaster = objectPool.getRaycaster();
  const mouse = objectPool.getVector2();
  
  return { 
    raycaster, 
    mouse,
    dispose: () => {
      objectPool.releaseRaycaster(raycaster);
      objectPool.releaseVector2(mouse);
    }
  };
};

export const getIntersectionPoint = (
  clientX: number,
  clientY: number,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene
): THREE.Vector3 | null => {
  const { raycaster, mouse, dispose } = createRaycaster();
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
  const result = intersects.length > 0 ? intersects[0].point.clone() : null;
  
  dispose();
  return result;
};

// Cache intersectable objects to avoid repeated traversal
let cachedIntersectableObjects: THREE.Object3D[] = [];
let cacheVersion = 0;

export const getIntersectableObjects = (scene: THREE.Scene, forceRefresh = false) => {
  const currentVersion = scene.children.length; // Simple version check
  
  if (forceRefresh || currentVersion !== cacheVersion || cachedIntersectableObjects.length === 0) {
    cachedIntersectableObjects = [];
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.visible && !object.userData.isHelper) {
        cachedIntersectableObjects.push(object);
      }
      if ((object.userData.isPoint || object.userData.isMeasurementGroup) && object.visible) {
        cachedIntersectableObjects.push(object);
      }
    });
    cacheVersion = currentVersion;
  }
  
  return cachedIntersectableObjects;
};

// Function to invalidate cache when scene changes
export const invalidateIntersectableCache = () => {
  cachedIntersectableObjects = [];
  cacheVersion = 0;
};
