
import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTouchGestures } from '../touch/useTouchGestures';
import { useMouseInteraction } from '../useMouseInteraction';

const isMobile = () => {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  } catch (error) {
    console.error('Error detecting mobile device:', error);
    return false;
  }
};

export const useMobileMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void,
  activeTool: 'select' | 'point' | 'measure' | 'move' = 'select',
  controls?: OrbitControls | null,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  // Always call hooks - never conditionally
  const mobile = isMobile();
  
  console.log('useMobileMouseInteraction: Mobile detected:', mobile);
  console.log('useMobileMouseInteraction: Dependencies available:', {
    renderer: !!renderer,
    camera: !!camera,
    scene: !!scene,
    controls: !!controls
  });

  // Use standard mouse interaction for desktop - always call this hook
  const mouseInteraction = useMouseInteraction(
    renderer,
    camera,
    targetObject,
    scene,
    onObjectSelect,
    activeTool,
    controls,
    onPointCreate,
    onMeasureCreate
  );

  // Mobile-specific zoom handling with error boundaries
  const handlePinchZoom = useCallback((scale: number, center: { x: number; y: number }) => {
    if (!mobile || !camera || !controls) {
      return;
    }
    
    try {
      const zoomFactor = (scale - 1) * 0.5;
      const currentDistance = camera.position.distanceTo(controls.target);
      const newDistance = Math.max(0.1, Math.min(1000, currentDistance - zoomFactor * 10));
      
      const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(controls.target).add(direction.multiplyScalar(newDistance));
      controls.update();
    } catch (error) {
      console.error('Error in handlePinchZoom:', error);
    }
  }, [mobile, camera, controls]);

  // Mobile-specific double tap to fit with null checks
  const handleDoubleTap = useCallback((position: { x: number; y: number }) => {
    if (!mobile || !camera || !controls || !scene) {
      return;
    }
    
    try {
      // Calculate bounding box of all visible objects
      const box = new THREE.Box3();
      scene.traverse((child) => {
        if (child.visible && (child as THREE.Mesh).geometry) {
          box.expandByObject(child);
        }
      });
      
      if (!box.isEmpty()) {
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const distance = maxSize * 2;
        
        controls.target.copy(center);
        camera.position.copy(center).add(new THREE.Vector3(distance, distance, distance));
        controls.update();
      }
    } catch (error) {
      console.error('Error in handleDoubleTap:', error);
    }
  }, [mobile, camera, controls, scene]);

  // Three finger tap to reset view with error handling
  const handleThreeFingerTap = useCallback(() => {
    if (!mobile || !camera || !controls) {
      return;
    }
    
    try {
      camera.position.set(5, 5, 5);
      controls.target.set(0, 0, 0);
      controls.update();
    } catch (error) {
      console.error('Error in handleThreeFingerTap:', error);
    }
  }, [mobile, camera, controls]);

  // Always call useTouchGestures hook - never conditionally
  const touchGestureResult = useTouchGestures(
    mobile && renderer ? renderer.domElement : null,
    mobile && controls ? controls : null,
    {
      onPinchZoom: handlePinchZoom,
      onDoubleTap: handleDoubleTap,
      onThreeFingerTap: handleThreeFingerTap,
      onSwipe: (direction, velocity) => {
        if (mobile) {
          console.log(`Swipe ${direction} with velocity ${velocity}`);
        }
      }
    }
  );

  // Mobile-specific touch feedback with improved error handling
  useEffect(() => {
    if (!mobile || !renderer) {
      return;
    }

    try {
      const canvas = renderer.domElement;
      
      const addTouchFeedback = (event: TouchEvent) => {
        try {
          canvas.style.filter = 'brightness(1.1)';
          setTimeout(() => {
            if (canvas && canvas.style) {
              canvas.style.filter = 'brightness(1)';
            }
          }, 100);
        } catch (error) {
          console.error('Error adding touch feedback:', error);
        }
      };

      canvas.addEventListener('touchstart', addTouchFeedback, { passive: true });
      
      console.log('useMobileMouseInteraction: Touch feedback setup complete');

      return () => {
        try {
          canvas.removeEventListener('touchstart', addTouchFeedback);
        } catch (error) {
          console.error('Error removing touch feedback listener:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up touch feedback:', error);
      return () => {};
    }
  }, [mobile, renderer]);

  return {
    ...mouseInteraction,
    isMobile: mobile
  };
};
