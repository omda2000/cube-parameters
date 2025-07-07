
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useResponsiveMode } from '../useResponsiveMode';

export const useControlsSetup = (
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null
) => {
  const controlsRef = useRef<OrbitControls | null>(null);
  const { isMobile, isTablet } = useResponsiveMode();

  useEffect(() => {
    if (!camera || !renderer) return;

    // Enhanced OrbitControls with mobile optimizations
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    
    controls.enableDamping = true;
    controls.dampingFactor = isMobile ? 0.08 : 0.05; // Smoother on mobile
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI;
    
    // Mobile-specific control settings
    if (isMobile || isTablet) {
      controls.rotateSpeed = 0.8; // Faster rotation for touch
      controls.zoomSpeed = 1.2; // More responsive zoom
      controls.panSpeed = 1.0; // Easier panning
      // Note: enableKeys is not available in OrbitControls, keyboard is disabled by default on mobile
      
      // Enhanced touch controls
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      
      // Touch-specific damping
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
    } else {
      // Desktop settings
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.8;
      controls.panSpeed = 0.8;
      
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }

    return () => {
      controls.dispose();
    };
  }, [camera, renderer, isMobile, isTablet]);

  return {
    controlsRef
  };
};
