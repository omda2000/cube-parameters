
import React, { useEffect, useRef } from 'react';
import { useTouchControls } from '../../hooks/useTouchControls';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface TouchGestureHandlerProps {
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
  onDoubleTap?: () => void;
  onPinchZoom?: (scale: number) => void;
  onThreeFingerTap?: () => void;
  children: React.ReactNode;
}

const TouchGestureHandler = ({
  camera,
  controls,
  onDoubleTap,
  onPinchZoom,
  onThreeFingerTap,
  children
}: TouchGestureHandlerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeFingerTouchRef = useRef(false);

  console.log('TouchGestureHandler: Received props:', {
    camera: camera ? 'Available' : 'Null',
    controls: controls ? 'Available' : 'Null'
  });

  // Initialize touch controls with validation
  const touchControlsResult = useTouchControls({
    camera,
    controls,
    onDoubleTap,
    onPinchZoom
  });

  console.log('TouchGestureHandler: Touch controls initialized:', {
    result: touchControlsResult ? 'Success' : 'Failed'
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.warn('TouchGestureHandler: Container ref not available');
      return;
    }

    console.log('TouchGestureHandler: Setting up three-finger touch detection');

    const handleTouchStart = (e: TouchEvent) => {
      console.log('TouchGestureHandler: Touch start detected, fingers:', e.touches.length);
      
      if (e.touches.length === 3) {
        threeFingerTouchRef.current = true;
        e.preventDefault();
        console.log('TouchGestureHandler: Three-finger touch detected');
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      console.log('TouchGestureHandler: Touch end detected, remaining fingers:', e.touches.length);
      
      if (threeFingerTouchRef.current && e.touches.length === 0) {
        threeFingerTouchRef.current = false;
        console.log('TouchGestureHandler: Three-finger tap completed');
        
        if (onThreeFingerTap) {
          onThreeFingerTap();
        }
      }
    };

    // Enhanced touch event listeners with better error handling
    try {
      container.addEventListener('touchstart', handleTouchStart, { 
        passive: false,
        capture: false 
      });
      container.addEventListener('touchend', handleTouchEnd, { 
        passive: false,
        capture: false 
      });
      
      console.log('TouchGestureHandler: Touch event listeners attached successfully');
    } catch (error) {
      console.error('TouchGestureHandler: Failed to attach touch listeners:', error);
    }

    return () => {
      try {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
        console.log('TouchGestureHandler: Touch event listeners cleaned up');
      } catch (error) {
        console.error('TouchGestureHandler: Error during cleanup:', error);
      }
    };
  }, [onThreeFingerTap]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ touchAction: 'manipulation' }} // Optimize for touch performance
    >
      {children}
    </div>
  );
};

export default TouchGestureHandler;
