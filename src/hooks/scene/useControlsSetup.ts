
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useControlsSetup = (
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null,
  mountReady: boolean = false
) => {
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!camera || !renderer || !mountReady) {
      console.log('useControlsSetup: Waiting for camera and renderer...');
      return;
    }

    console.log('useControlsSetup: Initializing controls...');

    // Enhanced OrbitControls
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
  }, [camera, renderer, mountReady]);

  return {
    controlsRef
  };
};
