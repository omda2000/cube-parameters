import { useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface StandardViewsHook {
  viewTop: () => void;
  viewFront: () => void;
  viewBack: () => void;
  viewBottom: () => void;
  viewRight: () => void;
  viewLeft: () => void;
  viewIsometric: () => void;
}

export const useStandardViews = (
  sceneRef: React.RefObject<THREE.Scene | null>,
  cameraRef: React.RefObject<THREE.Camera | null>,
  controlsRef: React.RefObject<OrbitControls | null>,
  rendererRef?: React.RefObject<THREE.WebGLRenderer | null>
): StandardViewsHook => {

  const animateToView = useCallback((targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const startPosition = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easedProgress);
      controlsRef.current!.target.lerpVectors(startTarget, targetLookAt, easedProgress);
      controlsRef.current!.update();
      
      if (rendererRef?.current) {
        rendererRef.current.render(sceneRef.current!, cameraRef.current!);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [sceneRef, cameraRef, controlsRef, rendererRef]);

  const getBoundingBox = useCallback(() => {
    if (!sceneRef.current) return new THREE.Box3();
    
    const box = new THREE.Box3();
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh && object.visible) {
        const objBox = new THREE.Box3().setFromObject(object);
        box.union(objBox);
      }
    });
    
    if (box.isEmpty()) {
      return new THREE.Box3(new THREE.Vector3(-5, -5, -5), new THREE.Vector3(5, 5, 5));
    }
    
    return box;
  }, [sceneRef]);

  const viewTop = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.z);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(0, distance, 0));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  const viewFront = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(0, 0, distance));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  const viewBack = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(0, 0, -distance));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  const viewBottom = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.z);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(0, -distance, 0));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  const viewRight = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.y, size.z);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(distance, 0, 0));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  const viewLeft = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.y, size.z);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(-distance, 0, 0));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  const viewIsometric = useCallback(() => {
    const box = getBoundingBox();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const distance = maxDim * 1.5;
    const targetPosition = center.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance));
    
    animateToView(targetPosition, center);
  }, [getBoundingBox, animateToView]);

  return {
    viewTop,
    viewFront,
    viewBack,
    viewBottom,
    viewRight,
    viewLeft,
    viewIsometric
  };
};