
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
}

export const useEnvironment = (
  scene: THREE.Scene | null,
  environment: EnvironmentSettings
) => {
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const isInitialized = useRef(false);

  // Initialize environment objects once
  useEffect(() => {
    if (!scene || isInitialized.current) return;

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
    gridRef.current = grid;
    scene.add(grid);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: environment.groundColor,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    planeRef.current = plane;
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Sky color
    scene.background = new THREE.Color(environment.skyColor);

    isInitialized.current = true;

    return () => {
      if (grid && scene) {
        scene.remove(grid);
        grid.dispose();
      }
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
    if (gridRef.current) {
      gridRef.current.visible = environment.showGrid;
    }
  }, [environment.showGrid]);

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

  return { gridRef, planeRef };
};
