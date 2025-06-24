
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

    // Ground plane at Z=0 for Z-up coordinate system
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: environment.groundColor,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    planeRef.current = plane;
    
    // Position ground plane at Z=0 (horizontal in Z-up system)
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    plane.visible = environment.showGround;
    scene.add(plane);

    // Sky color
    scene.background = new THREE.Color(environment.skyColor);

    isInitialized.current = true;

    return () => {
      if (plane && scene) {
        scene.remove(plane);
        planeGeometry.dispose();
        planeMaterial.dispose();
      }
      isInitialized.current = false;
    };
  }, [scene]);

  // Update grid visibility
  useEffect(() => {
    if (gridHelper) {
      gridHelper.visible = environment.showGrid;
    }
  }, [environment.showGrid, gridHelper]);

  // Update ground visibility
  useEffect(() => {
    if (planeRef.current) {
      planeRef.current.visible = environment.showGround;
    }
  }, [environment.showGround]);

  // Update ground color
  useEffect(() => {
    if (planeRef.current) {
      (planeRef.current.material as THREE.MeshStandardMaterial).color.set(environment.groundColor);
    }
  }, [environment.groundColor]);

  // Update sky color
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color(environment.skyColor);
    }
  }, [scene, environment.skyColor]);

  return { planeRef };
};
