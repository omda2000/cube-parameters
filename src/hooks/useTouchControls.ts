
import { useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface TouchControlsOptions {
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
  onDoubleTap?: () => void;
  onPinchZoom?: (scale: number) => void;
}

export const useTouchControls = ({
  camera,
  controls,
  onDoubleTap,
  onPinchZoom
}: TouchControlsOptions) => {
  const lastTouchTime = useRef(0);
  const touchStartDistance = useRef(0);
  const initialPinchDistance = useRef(0);

  const handleDoubleTap = useCallback(() => {
    if (onDoubleTap) {
      onDoubleTap();
    } else if (controls) {
      // Default: reset view
      controls.reset();
    }
  }, [controls, onDoubleTap]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 2) {
      // Pinch gesture start
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      touchStartDistance.current = distance;
      initialPinchDistance.current = distance;
    } else if (event.touches.length === 1) {
      // Single touch - check for double tap
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTouchTime.current;
      
      if (timeDiff < 300) { // Double tap detected
        handleDoubleTap();
      }
      lastTouchTime.current = currentTime;
    }
  }, [handleDoubleTap]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.touches.length === 2 && onPinchZoom) {
      // Pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (initialPinchDistance.current > 0) {
        const scale = distance / initialPinchDistance.current;
        onPinchZoom(scale);
      }
    }
  }, [onPinchZoom]);

  const handleTouchEnd = useCallback(() => {
    touchStartDistance.current = 0;
    initialPinchDistance.current = 0;
  }, []);

  useEffect(() => {
    if (!controls) return;

    const element = controls.domElement;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [controls, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    handleDoubleTap
  };
};
