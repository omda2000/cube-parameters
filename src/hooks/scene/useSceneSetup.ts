
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const useSceneSetup = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ucsHelperRef = useRef<THREE.AxesHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
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

    return () => {
      // Cleanup will be handled by parent hook
    };
  }, []);

  return {
    sceneRef,
    ucsHelperRef,
    gridHelperRef
  };
};
