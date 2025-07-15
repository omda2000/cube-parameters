
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
  showGround: boolean;
}

export const useEnvironment = (
  scene: THREE.Scene | null,
  environment: EnvironmentSettings,
  gridHelper: THREE.GridHelper | null
) => {
  const planeRef = useRef<THREE.Mesh | null>(null);
  const isInitialized = useRef(false);

  // Initialize environment objects once
  useEffect(() => {
    if (!scene || isInitialized.current) return;

    // Ground plane removed as requested

    // Set background to light gray/white for workplane visibility
    scene.background = new THREE.Color('#F8F8F8');

    isInitialized.current = true;
  }, [scene, environment.skyColor]);

  // Update grid visibility and mark as helper
  useEffect(() => {
    if (gridHelper) {
      gridHelper.visible = environment.showGrid;
      gridHelper.userData.isHelper = true;
    }
  }, [environment.showGrid, gridHelper]);


  // Update sky color (override to light background for workplane)
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color('#F8F8F8');
    }
  }, [scene]);

  return { planeRef };
};
