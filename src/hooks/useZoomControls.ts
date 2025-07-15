
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
  cameraRef: React.RefObject<THREE.Camera | null>,
  controlsRef: React.RefObject<OrbitControls | null>,
  selectedObject: SceneObject | null,
  rendererRef?: React.RefObject<THREE.WebGLRenderer | null>
): ZoomControlsHook => {
  const controlsRefInternal = useRef<ZoomControlsHook | null>(null);

  useEffect(() => {
    const zoomControls: ZoomControlsHook = {
      zoomAll: () => {
        console.log('Executing zoomAll');
        if (!sceneRef.current || !cameraRef.current || !controlsRef.current) {
          console.log('Missing refs for zoomAll');
          return;
        }
        
        const allObjects: THREE.Object3D[] = [];
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            allObjects.push(object);
          }
        });
        
        if (allObjects.length === 0) {
          console.log('No objects found for zoomAll');
          return;
        }
        
        const box = new THREE.Box3();
        allObjects.forEach(obj => {
          if (obj.visible) {
            const objBox = new THREE.Box3().setFromObject(obj);
            box.union(objBox);
          }
        });
        
        if (box.isEmpty()) {
          console.log('Bounding box is empty');
          return;
        }
        
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        let distance: number;
        if (cameraRef.current instanceof THREE.PerspectiveCamera) {
          distance = maxDim / (2 * Math.tan((cameraRef.current.fov * Math.PI) / 360)) * 1.5;
        } else if (cameraRef.current instanceof THREE.OrthographicCamera) {
          // For orthographic camera, fit the scene properly
          const orthoCamera = cameraRef.current;
          const maxDim = Math.max(size.x, size.y, size.z);
          const zoom = Math.min(
            Math.abs(orthoCamera.right - orthoCamera.left) / maxDim,
            Math.abs(orthoCamera.top - orthoCamera.bottom) / maxDim
          ) * 0.8;
          
          orthoCamera.zoom = zoom;
          orthoCamera.updateProjectionMatrix();
          distance = maxDim * 1.5;
        } else {
          distance = maxDim * 1.5;
        }
        
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
          
          // Force render update
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },
      
      zoomToSelected: () => {
        console.log('Executing zoomToSelected', selectedObject);
        if (!selectedObject || !cameraRef.current || !controlsRef.current) {
          console.log('No selected object or missing refs');
          return;
        }
        
        const object = selectedObject.object;
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        let distance: number;
        if (cameraRef.current instanceof THREE.PerspectiveCamera) {
          distance = maxDim / (2 * Math.tan((cameraRef.current.fov * Math.PI) / 360)) * 2;
        } else if (cameraRef.current instanceof THREE.OrthographicCamera) {
          const orthoCamera = cameraRef.current;
          const zoom = Math.min(
            Math.abs(orthoCamera.right - orthoCamera.left) / maxDim,
            Math.abs(orthoCamera.top - orthoCamera.bottom) / maxDim
          ) * 0.5;
          
          orthoCamera.zoom = zoom;
          orthoCamera.updateProjectionMatrix();
          distance = maxDim * 2;
        } else {
          distance = maxDim * 2;
        }
        
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
          
          // Force render update
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },

      zoomIn: () => {
        console.log('Executing zoomIn');
        if (!cameraRef.current || !controlsRef.current) {
          console.log('Missing refs for zoomIn');
          return;
        }
        
        const target = controlsRef.current.target;
        
        if (cameraRef.current instanceof THREE.OrthographicCamera) {
          // For orthographic camera, adjust zoom
          const orthoCamera = cameraRef.current;
          orthoCamera.zoom = Math.min(orthoCamera.zoom * 1.25, 10);
          orthoCamera.updateProjectionMatrix();
          controlsRef.current.update();
          
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          return;
        }
        
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
          
          // Force render update
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },

      zoomOut: () => {
        console.log('Executing zoomOut');
        if (!cameraRef.current || !controlsRef.current) {
          console.log('Missing refs for zoomOut');
          return;
        }
        
        const target = controlsRef.current.target;
        
        if (cameraRef.current instanceof THREE.OrthographicCamera) {
          // For orthographic camera, adjust zoom
          const orthoCamera = cameraRef.current;
          orthoCamera.zoom = Math.max(orthoCamera.zoom * 0.8, 0.1);
          orthoCamera.updateProjectionMatrix();
          controlsRef.current.update();
          
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          return;
        }
        
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
          
          // Force render update
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },

      resetView: () => {
        console.log('Executing resetView');
        if (!cameraRef.current || !controlsRef.current) {
          console.log('Missing refs for resetView');
          return;
        }
        
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
          
          // Force render update
          if (rendererRef?.current) {
            rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          }
          
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
  }, [sceneRef, cameraRef, controlsRef, selectedObject, rendererRef]);

  return controlsRefInternal.current || {
    zoomAll: () => { console.log('zoomAll not ready'); },
    zoomToSelected: () => { console.log('zoomToSelected not ready'); },
    zoomIn: () => { console.log('zoomIn not ready'); },
    zoomOut: () => { console.log('zoomOut not ready'); },
    resetView: () => { console.log('resetView not ready'); }
  };
};
