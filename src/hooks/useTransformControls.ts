
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

    // Transform Controls setup
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
    });
    scene.add(transformControls);

    return () => {
      if (transformControls) {
        scene.remove(transformControls);
      }
    };
  }, [scene, camera, renderer, orbitControls]);

  // Update transform mode when selected
  useEffect(() => {
    if (transformControlsRef.current && isSelected) {
      transformControlsRef.current.setMode(transformMode);
    }
  }, [transformMode, isSelected]);

  return { transformControlsRef };
};
