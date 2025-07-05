
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { SceneObject } from '../types/model';

interface ZoomControlsHook {
  zoomAll: () => void;
  zoomToSelected: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

export const useZoomControls = (
  sceneRef: React.RefObject<THREE.Scene | null>,
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>,
  controlsRef: React.RefObject<OrbitControls | null>,
  selectedObject: SceneObject | null
): ZoomControlsHook => {
  const controlsRefInternal = useRef<ZoomControlsHook | null>(null);

  useEffect(() => {
    const zoomControls: ZoomControlsHook = {
      zoomAll: () => {
        if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
        
        const allObjects: THREE.Object3D[] = [];
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            allObjects.push(object);
          }
        });
        
        if (allObjects.length === 0) return;
        
        const box = new THREE.Box3();
        allObjects.forEach(obj => {
          if (obj.visible) {
            const objBox = new THREE.Box3().setFromObject(obj);
            box.union(objBox);
          }
        });
        
        if (box.isEmpty()) return;
        
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim / (2 * Math.tan((cameraRef.current.fov * Math.PI) / 360)) * 1.5;
        
        const targetPosition = center.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance));
        
        // Smooth transition
        const startPosition = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easedProgress);
          controlsRef.current!.target.lerpVectors(startTarget, center, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },
      
      zoomToSelected: () => {
        if (!selectedObject || !cameraRef.current || !controlsRef.current) return;
        
        const object = selectedObject.object;
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim / (2 * Math.tan((cameraRef.current.fov * Math.PI) / 360)) * 2;
        
        const targetPosition = center.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance));
        
        // Smooth transition
        const startPosition = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easedProgress);
          controlsRef.current!.target.lerpVectors(startTarget, center, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },

      zoomIn: () => {
        if (!cameraRef.current || !controlsRef.current) return;
        
        const target = controlsRef.current.target;
        const direction = cameraRef.current.position.clone().sub(target).normalize();
        const currentDistance = cameraRef.current.position.distanceTo(target);
        const newDistance = Math.max(currentDistance * 0.8, controlsRef.current.minDistance);
        const newPosition = target.clone().add(direction.multiplyScalar(newDistance));
        
        // Smooth zoom
        const startPosition = cameraRef.current.position.clone();
        const startTime = Date.now();
        const duration = 300;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, newPosition, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },

      zoomOut: () => {
        if (!cameraRef.current || !controlsRef.current) return;
        
        const target = controlsRef.current.target;
        const direction = cameraRef.current.position.clone().sub(target).normalize();
        const currentDistance = cameraRef.current.position.distanceTo(target);
        const newDistance = Math.min(currentDistance * 1.25, controlsRef.current.maxDistance);
        const newPosition = target.clone().add(direction.multiplyScalar(newDistance));
        
        // Smooth zoom
        const startPosition = cameraRef.current.position.clone();
        const startTime = Date.now();
        const duration = 300;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, newPosition, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },

      resetView: () => {
        if (!cameraRef.current || !controlsRef.current) return;
        
        const targetPosition = new THREE.Vector3(5, 5, 5);
        const targetLookAt = new THREE.Vector3(0, 0, 0);
        
        // Smooth transition
        const startPosition = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easedProgress);
          controlsRef.current!.target.lerpVectors(startTarget, targetLookAt, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      }
    };

    controlsRefInternal.current = zoomControls;

    // Expose zoom controls globally
    (window as any).__zoomControls = zoomControls;

    return () => {
      delete (window as any).__zoomControls;
    };
  }, [sceneRef, cameraRef, controlsRef, selectedObject]);

  return controlsRefInternal.current || {
    zoomAll: () => {},
    zoomToSelected: () => {},
    zoomIn: () => {},
    zoomOut: () => {},
    resetView: () => {}
  };
};
