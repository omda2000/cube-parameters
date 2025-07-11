
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const isMobile = () => {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  } catch (error) {
    console.warn('Error detecting mobile device:', error);
    return false;
  }
};

export const useControlsSetup = (
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null
) => {
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    // Enhanced validation
    if (!camera) {
      console.warn('Camera not available for controls setup');
      return;
    }
    
    if (!renderer) {
      console.warn('Renderer not available for controls setup');
      return;
    }

    if (!renderer.domElement) {
      console.warn('Renderer DOM element not available for controls setup');
      return;
    }

    try {
      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      
      const mobile = isMobile();
      
      // Enhanced OrbitControls with mobile optimization and error handling
      try {
        controls.enableDamping = true;
        controls.dampingFactor = mobile ? 0.1 : 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 0.1;
        controls.maxDistance = 1000;
        controls.maxPolarAngle = Math.PI;
      } catch (error) {
        console.error('Error setting basic controls properties:', error);
      }
      
      if (mobile) {
        try {
          // Mobile-specific touch settings
          controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          };
          
          controls.rotateSpeed = 0.8;
          controls.zoomSpeed = 1.2;
          controls.panSpeed = 1.0;
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
            try {
              if (e.touches.length > 1 || e.target === canvas) {
                e.preventDefault();
              }
            } catch (error) {
              console.warn('Error in preventBounce handler:', error);
            }
          };
          
          const preventContextMenu = (e: Event) => {
            try {
              e.preventDefault();
            } catch (error) {
              console.warn('Error in preventContextMenu handler:', error);
            }
          };
          
          document.addEventListener('touchmove', preventBounce, { passive: false });
          canvas.addEventListener('contextmenu', preventContextMenu);
          
          return () => {
            try {
              controls.dispose();
              document.removeEventListener('touchmove', preventBounce);
              canvas.removeEventListener('contextmenu', preventContextMenu);
            } catch (error) {
              console.error('Error in mobile controls cleanup:', error);
            }
          };
        } catch (error) {
          console.error('Error setting up mobile controls:', error);
        }
      } else {
        try {
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
        } catch (error) {
          console.error('Error setting up desktop controls:', error);
        }
      }

      console.log('Controls setup completed successfully');

      return () => {
        try {
          controls.dispose();
        } catch (error) {
          console.error('Error disposing controls:', error);
        }
      };
    } catch (error) {
      console.error('Error creating OrbitControls:', error);
      return () => {};
    }
  }, [camera, renderer]);

  return {
    controlsRef
  };
};
