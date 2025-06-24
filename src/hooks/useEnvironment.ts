
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
  showEdges: boolean;
}

export const useEnvironment = (
  scene: THREE.Scene | null,
  environment: EnvironmentSettings,
  gridHelper: THREE.GridHelper | null
) => {
  const planeRef = useRef<THREE.Mesh | null>(null);
  const edgeHelpersRef = useRef<THREE.LineSegments[]>([]);
  const isInitialized = useRef(false);

  // Initialize environment objects once
  useEffect(() => {
    if (!scene || isInitialized.current) return;

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
      if (plane && scene) {
        scene.remove(plane);
        planeGeometry.dispose();
        planeMaterial.dispose();
      }
      // Clean up edge helpers
      edgeHelpersRef.current.forEach(helper => {
        if (scene.children.includes(helper)) {
          scene.remove(helper);
        }
        helper.geometry.dispose();
        (helper.material as THREE.LineBasicMaterial).dispose();
      });
      edgeHelpersRef.current = [];
      isInitialized.current = false;
    };
  }, [scene]);

  // Update grid visibility
  useEffect(() => {
    if (gridHelper) {
      gridHelper.visible = environment.showGrid;
    }
  }, [environment.showGrid, gridHelper]);

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

  // Update edges visibility
  useEffect(() => {
    if (!scene) return;

    // Remove existing edge helpers
    edgeHelpersRef.current.forEach(helper => {
      if (scene.children.includes(helper)) {
        scene.remove(helper);
      }
      helper.geometry.dispose();
      (helper.material as THREE.LineBasicMaterial).dispose();
    });
    edgeHelpersRef.current = [];

    if (environment.showEdges) {
      // Add edge helpers for all meshes in the scene
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.geometry) {
          const edges = new THREE.EdgesGeometry(object.geometry);
          const edgeHelper = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 })
          );
          
          // Copy transform from the original mesh
          edgeHelper.position.copy(object.position);
          edgeHelper.rotation.copy(object.rotation);
          edgeHelper.scale.copy(object.scale);
          edgeHelper.matrix.copy(object.matrix);
          
          scene.add(edgeHelper);
          edgeHelpersRef.current.push(edgeHelper);
        }
      });
    }
  }, [environment.showEdges, scene]);

  return { planeRef, edgeHelpersRef };
};
