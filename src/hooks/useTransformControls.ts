
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useTransformControls = (
  scene: THREE.Scene | null,
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null,
  orbitControls: OrbitControls | null,
  transformMode: 'translate' | 'rotate' | 'scale',
  isSelected: boolean
) => {
  const transformControlsRef = useRef<TransformControls | null>(null);

  useEffect(() => {
    if (!scene || !camera || !renderer || !orbitControls) return;

    // Transform Controls setup with improved stability
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    
    // Improve transform controls settings
    transformControls.setSize(0.8); // Slightly smaller handles
    transformControls.setSpace('local'); // Use local space for more intuitive transforms
    
    // Better interaction handling
    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
      
      // Disable damping during transform to prevent drift
      if (event.value) {
        orbitControls.enableDamping = false;
      } else {
        orbitControls.enableDamping = true;
      }
    });

    // Fix object position stability during camera operations
    transformControls.addEventListener('objectChange', () => {
      // Ensure the object position is stable
      if (transformControls.object) {
        transformControls.object.updateMatrixWorld(true);
      }
    });
    
    console.log('Adding transform controls to scene:', transformControls);
    scene.add(transformControls as any);

    return () => {
      if (transformControlsRef.current && scene) {
        console.log('Removing transform controls from scene');
        scene.remove(transformControlsRef.current as any);
        transformControlsRef.current.dispose();
        transformControlsRef.current = null;
      }
    };
  }, [scene, camera, renderer, orbitControls]);

  // Update transform mode and attachment
  useEffect(() => {
    if (transformControlsRef.current) {
      if (isSelected) {
        transformControlsRef.current.setMode(transformMode);
        // TransformControls doesn't have a visible property, it's controlled by attachment
        transformControlsRef.current.enabled = true;
      } else {
        transformControlsRef.current.enabled = false;
      }
    }
  }, [transformMode, isSelected]);

  return { transformControlsRef };
};
