
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useMobileControlsSetup = (
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null
) => {
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!camera || !renderer) return;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    
    // Mobile-optimized settings
    controls.enableDamping = true;
    controls.dampingFactor = 0.1; // Slightly higher for smoother mobile experience
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI;
    
    // Mobile-specific touch settings
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    
    // Adjusted speeds for mobile
    controls.rotateSpeed = 0.8; // Increased for better responsiveness
    controls.zoomSpeed = 1.2; // Increased for touch zoom
    controls.panSpeed = 1.0; // Increased for touch pan
    
    // Mobile-specific limits
    controls.minZoom = 0.1;
    controls.maxZoom = 10;
    
    // Disable right-click context menu on mobile
    const preventContextMenu = (e: Event) => e.preventDefault();
    renderer.domElement.addEventListener('contextmenu', preventContextMenu);
    
    // Add touch-specific event handling
    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    
    // Prevent iOS Safari bounce scrolling
    const preventBounce = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventBounce, { passive: false });

    return () => {
      controls.dispose();
      renderer.domElement.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('touchmove', preventBounce);
    };
  }, [camera, renderer]);

  return {
    controlsRef
  };
};
