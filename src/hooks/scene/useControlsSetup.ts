
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
};

export const useControlsSetup = (
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null
) => {
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!camera || !renderer) return;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    
    const mobile = isMobile();
    
    // Enhanced OrbitControls with mobile optimization
    controls.enableDamping = true;
    controls.dampingFactor = mobile ? 0.1 : 0.05; // Higher damping for mobile
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI;
    
    if (mobile) {
      // Mobile-specific touch settings
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      
      // Adjusted speeds for mobile touch
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 1.0;
      
      // Mobile zoom limits
      controls.minZoom = 0.1;
      controls.maxZoom = 10;
      
      // Configure canvas for mobile
      const canvas = renderer.domElement;
      canvas.style.touchAction = 'none';
      
      // Use type assertion for webkit-specific properties
      const canvasStyle = canvas.style as any;
      canvasStyle.webkitTouchCallout = 'none';
      canvasStyle.webkitUserSelect = 'none';
      
      // Prevent iOS Safari bounce scrolling
      const preventBounce = (e: TouchEvent) => {
        if (e.touches.length > 1 || e.target === canvas) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', preventBounce, { passive: false });
      
      // Prevent context menu on mobile
      const preventContextMenu = (e: Event) => e.preventDefault();
      canvas.addEventListener('contextmenu', preventContextMenu);
      
      return () => {
        controls.dispose();
        document.removeEventListener('touchmove', preventBounce);
        canvas.removeEventListener('contextmenu', preventContextMenu);
      };
    } else {
      // Desktop settings
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };

      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.8;
      controls.panSpeed = 0.8;
    }

    return () => {
      controls.dispose();
    };
  }, [camera, renderer]);

  return {
    controlsRef
  };
};
