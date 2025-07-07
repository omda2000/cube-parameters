
import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeViewerHandlersProps {
  controls: OrbitControls | null;
  camera: THREE.Camera | null;
  scene: THREE.Scene | null;
}

export const useThreeViewerHandlers = ({ controls, camera, scene }: ThreeViewerHandlersProps) => {
  const handleDoubleTap = React.useCallback(() => {
    if (controls) {
      controls.reset();
    }
  }, [controls]);

  const handlePinchZoom = React.useCallback((scale: number) => {
    if (camera && camera instanceof THREE.PerspectiveCamera) {
      const newPosition = camera.position.clone();
      newPosition.multiplyScalar(2 - scale);
      camera.position.copy(newPosition);
    }
  }, [camera]);

  const handleZoomIn = React.useCallback(() => {
    if (controls && camera) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.add(direction.multiplyScalar(0.5));
      controls.update();
    }
  }, [controls, camera]);

  const handleZoomOut = React.useCallback(() => {
    if (controls && camera) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.add(direction.multiplyScalar(-0.5));
      controls.update();
    }
  }, [controls, camera]);

  const handleZoomAll = React.useCallback(() => {
    if (controls && scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      controls.target.copy(center);
      
      if (camera) {
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.copy(center);
        camera.position.z += maxDim * 2;
        camera.lookAt(center);
      }
      
      controls.update();
    }
  }, [controls, scene, camera]);

  const handleResetView = React.useCallback(() => {
    if (controls) {
      controls.reset();
    }
  }, [controls]);

  return {
    handleDoubleTap,
    handlePinchZoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomAll,
    handleResetView
  };
};
