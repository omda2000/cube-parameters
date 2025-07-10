
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

  console.log('useTouchControls: Initializing with:', {
    camera: camera ? `${camera.type} camera` : 'No camera',
    controls: controls ? 'OrbitControls available' : 'No controls',
    hasDoubleTapHandler: !!onDoubleTap,
    hasPinchHandler: !!onPinchZoom
  });

  const handleDoubleTap = useCallback(() => {
    console.log('useTouchControls: Double tap detected');
    
    if (onDoubleTap) {
      console.log('useTouchControls: Calling custom double tap handler');
      onDoubleTap();
    } else if (controls) {
      console.log('useTouchControls: Using default reset behavior');
      controls.reset();
    } else {
      console.warn('useTouchControls: No double tap handler or controls available');
    }
  }, [controls, onDoubleTap]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!controls) {
      console.warn('useTouchControls: Touch start ignored - no controls available');
      return;
    }

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
      
      console.log('useTouchControls: Pinch gesture started, initial distance:', distance.toFixed(2));
      
    } else if (event.touches.length === 1) {
      // Single touch - check for double tap
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTouchTime.current;
      
      console.log('useTouchControls: Single touch detected, time diff:', timeDiff);
      
      if (timeDiff < 300) { // Double tap detected
        console.log('useTouchControls: Double tap timing met');
        handleDoubleTap();
      }
      lastTouchTime.current = currentTime;
    }
  }, [handleDoubleTap, controls]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!controls || !onPinchZoom) {
      return;
    }

    if (event.touches.length === 2) {
      // Pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (initialPinchDistance.current > 0) {
        const scale = distance / initialPinchDistance.current;
        console.log('useTouchControls: Pinch zoom scale:', scale.toFixed(3));
        onPinchZoom(scale);
      }
    }
  }, [onPinchZoom, controls]);

  const handleTouchEnd = useCallback(() => {
    if (touchStartDistance.current > 0 || initialPinchDistance.current > 0) {
      console.log('useTouchControls: Touch gesture ended, resetting distances');
    }
    
    touchStartDistance.current = 0;
    initialPinchDistance.current = 0;
  }, []);

  useEffect(() => {
    if (!controls) {
      console.warn('useTouchControls: No controls available for touch event setup');
      return;
    }

    const element = controls.domElement;
    
    if (!element) {
      console.error('useTouchControls: Controls domElement not available');
      return;
    }

    console.log('useTouchControls: Setting up touch event listeners on:', element.tagName);
    
    try {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      console.log('useTouchControls: Touch event listeners attached successfully');
    } catch (error) {
      console.error('useTouchControls: Failed to attach touch event listeners:', error);
    }

    return () => {
      try {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        console.log('useTouchControls: Touch event listeners cleaned up');
      } catch (error) {
        console.error('useTouchControls: Error during touch listener cleanup:', error);
      }
    };
  }, [controls, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    handleDoubleTap
  };
};
