
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { EnvironmentSettings } from '../types/model';

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

    // Ground plane - horizontal at Z=0
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: environment.groundColor,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    planeRef.current = plane;
    
    // Position and rotate ground plane to be horizontal
    plane.position.set(0, 0, 0);
    plane.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
    plane.receiveShadow = true;
    plane.visible = environment.showGround;
    
    // Mark as helper so it doesn't interfere with selection
    plane.userData.isHelper = true;
    
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
  }, [scene, environment.groundColor, environment.showGround, environment.skyColor]);

  // Update grid visibility and mark as helper
  useEffect(() => {
    if (gridHelper) {
      gridHelper.visible = environment.showGrid;
      gridHelper.userData.isHelper = true;
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
