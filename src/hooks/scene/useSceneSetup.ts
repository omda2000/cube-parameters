
import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export const useSceneSetup = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ucsHelperRef = useRef<THREE.AxesHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Function to calculate adaptive grid size based on scene bounding box
  const updateAdaptiveGrid = useCallback(() => {
    if (!sceneRef.current || !gridHelperRef.current) return;

    // Calculate bounding box of all non-helper objects in the scene
    const box = new THREE.Box3();
    const meshes: THREE.Mesh[] = [];
    
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        meshes.push(child);
      }
    });

    if (meshes.length > 0) {
      meshes.forEach(mesh => {
        box.expandByObject(mesh);
      });
    }

    // Calculate grid size based on bounding box with minimum 10x10m
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.z);
    const gridSize = Math.max(maxDimension * 1.5, 10); // 1.5x the model size or minimum 10m
    const divisions = Math.max(Math.ceil(gridSize), 10); // 1m x 1m grid units

    console.log('🔄 Updating adaptive grid:', { 
      boundingBox: { x: size.x, y: size.y, z: size.z },
      gridSize, 
      divisions 
    });

    // Remove old grid and create new one
    sceneRef.current.remove(gridHelperRef.current);
    gridHelperRef.current.dispose();

    const newGrid = new THREE.GridHelper(gridSize, divisions, 0x444444, 0x222222);
    gridHelperRef.current = newGrid;
    newGrid.position.set(0, 0, 0);
    sceneRef.current.add(newGrid);
  }, []);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Add UCS helper
    const ucsHelper = new THREE.AxesHelper(2);
    ucsHelperRef.current = ucsHelper;
    ucsHelper.position.set(0, 0, 0);
    scene.add(ucsHelper);

    // Initial grid (minimum 10x10m with 1m units)
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
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
    gridHelperRef,
    updateAdaptiveGrid
  };
};
