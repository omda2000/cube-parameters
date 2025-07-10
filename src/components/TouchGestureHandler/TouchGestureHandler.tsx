
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

  useTouchControls({
    camera,
    controls,
    onDoubleTap,
    onPinchZoom
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 3) {
        threeFingerTouchRef.current = true;
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (threeFingerTouchRef.current && e.touches.length === 0) {
        threeFingerTouchRef.current = false;
        if (onThreeFingerTap) {
          onThreeFingerTap();
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onThreeFingerTap]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};

export default TouchGestureHandler;
