
import { useCallback } from 'react';
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useZoomControls = (
  camera: THREE.PerspectiveCamera | null,
  controls: OrbitControls | null,
  scene: THREE.Scene | null
) => {
  const calculateBoundingBox = useCallback((objects: THREE.Object3D[]) => {
    const box = new THREE.Box3();
    
    objects.forEach(object => {
      if (object.visible) {
        const objectBox = new THREE.Box3().setFromObject(object);
        box.union(objectBox);
      }
    });
    
    return box;
  }, []);

  const zoomToFit = useCallback((objects: THREE.Object3D[], padding = 1.5) => {
    if (!camera || !controls || objects.length === 0) return;

    const box = calculateBoundingBox(objects);
    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const distance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360)) * padding;
    
    // Smooth transition
    const startPosition = camera.position.clone();
    const targetPosition = center.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance));
    
    const startTime = Date.now();
    const duration = 1000; // 1 second

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
      controls.target.lerp(center, easedProgress);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [camera, controls, calculateBoundingBox]);

  const zoomAll = useCallback(() => {
    if (!scene) return;
    
    const allObjects: THREE.Object3D[] = [];
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
        allObjects.push(object);
      }
    });
    
    zoomToFit(allObjects);
  }, [scene, zoomToFit]);

  const zoomToSelected = useCallback((selectedObject: THREE.Object3D | null) => {
    if (!selectedObject) return;
    
    zoomToFit([selectedObject], 2);
  }, [zoomToFit]);

  const zoomIn = useCallback(() => {
    if (!camera || !controls) return;
    
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    const targetPosition = camera.position.clone().add(direction.multiplyScalar(2));
    const startPosition = camera.position.clone();
    
    const startTime = Date.now();
    const duration = 300;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      camera.position.lerpVectors(startPosition, targetPosition, progress);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [camera, controls]);

  const zoomOut = useCallback(() => {
    if (!camera || !controls) return;
    
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    const targetPosition = camera.position.clone().sub(direction.multiplyScalar(2));
    const startPosition = camera.position.clone();
    
    const startTime = Date.now();
    const duration = 300;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      camera.position.lerpVectors(startPosition, targetPosition, progress);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [camera, controls]);

  const resetView = useCallback(() => {
    if (!camera || !controls) return;
    
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const targetPosition = new THREE.Vector3(5, 5, 5);
    const targetTarget = new THREE.Vector3(0, 0, 0);
    
    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
      controls.target.lerpVectors(startTarget, targetTarget, easedProgress);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [camera, controls]);

  return {
    zoomAll,
    zoomToSelected,
    zoomIn,
    zoomOut,
    resetView
  };
};
