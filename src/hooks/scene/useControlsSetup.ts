
import { useRef, useEffect, type RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useControlsSetup = (
  cameraRef: RefObject<THREE.PerspectiveCamera | null>,
  rendererRef: RefObject<THREE.WebGLRenderer | null>,
  mountReady: boolean = false
) => {
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!mountReady) return;

    let attempts = 0;
    const maxAttempts = 50; // ~5 seconds

    const initControls = () => {
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!camera || !renderer) {
        if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(initControls, 100);
        } else {
          console.error('useControlsSetup: Failed to initialize controls');
        }
        return;
      }

      console.log('useControlsSetup: Initializing controls...');

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;

      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 0.1;
      controls.maxDistance = 1000;
      controls.maxPolarAngle = Math.PI;
    
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

      console.log('useControlsSetup: Controls initialized successfully');

      return () => {
        controls.dispose();
      };
    };

    initControls();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
    };
  }, [cameraRef, rendererRef, mountReady]);

  return {
    controlsRef
  };
};
