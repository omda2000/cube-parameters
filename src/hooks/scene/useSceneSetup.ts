
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const useSceneSetup = (isMountReady: boolean) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ucsHelperRef = useRef<THREE.AxesHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    if (!isMountReady) {
      console.log('Scene setup waiting for mount...');
      return;
    }

    try {
      console.log('Setting up scene...');
      
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Add UCS and grid helpers
      const ucsHelper = new THREE.AxesHelper(2);
      ucsHelperRef.current = ucsHelper;
      ucsHelper.position.set(0, 0, 0);
      scene.add(ucsHelper);

      const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
      gridHelperRef.current = gridHelper;
      gridHelper.position.set(0, 0, 0);
      scene.add(gridHelper);

      setIsSceneReady(true);
      console.log('Scene setup completed successfully');
    } catch (error) {
      console.error('Error setting up scene:', error);
      setIsSceneReady(false);
    }

    return () => {
      // Cleanup will be handled by parent hook
    };
  }, [isMountReady]);

  return {
    sceneRef,
    ucsHelperRef,
    gridHelperRef,
    isSceneReady
  };
};
