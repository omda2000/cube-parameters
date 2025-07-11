
import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

export const useCameraSetup = (mountRef: React.RefObject<HTMLDivElement>, isMountReady: boolean) => {
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  const [isOrthographic, setIsOrthographic] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const switchCamera = useCallback((orthographic: boolean, controlsRef?: React.RefObject<any>) => {
    if (!isInitialized) {
      console.warn('Cannot switch camera - cameras not initialized');
      return;
    }

    try {
      if (!mountRef.current) {
        console.warn('Mount ref not available for camera switch');
        return;
      }
      
      if (!controlsRef?.current) {
        console.warn('Controls ref not available for camera switch');
        return;
      }

      if (!perspectiveCameraRef.current || !orthographicCameraRef.current) {
        console.warn('Cameras not initialized for switch');
        return;
      }

      const controls = controlsRef.current;
      
      let currentPosition: THREE.Vector3;
      let currentTarget: THREE.Vector3;
      
      try {
        currentPosition = controls.object.position.clone();
        currentTarget = controls.target.clone();
      } catch (error) {
        console.warn('Error getting current camera state, using defaults:', error);
        currentPosition = new THREE.Vector3(5, 5, 5);
        currentTarget = new THREE.Vector3(0, 0, 0);
      }

      if (orthographic && orthographicCameraRef.current) {
        const orthoCamera = orthographicCameraRef.current;
        orthoCamera.position.copy(currentPosition);
        orthoCamera.lookAt(currentTarget);
        
        controls.object = orthoCamera;
        activeCameraRef.current = orthoCamera;
        setIsOrthographic(true);
      } else if (!orthographic && perspectiveCameraRef.current) {
        const perspCamera = perspectiveCameraRef.current;
        perspCamera.position.copy(currentPosition);
        perspCamera.lookAt(currentTarget);
        
        controls.object = perspCamera;
        activeCameraRef.current = perspCamera;
        setIsOrthographic(false);
      }

      try {
        controls.target.copy(currentTarget);
        controls.update();
      } catch (error) {
        console.error('Error updating controls after camera switch:', error);
      }
    } catch (error) {
      console.error('Error in switchCamera:', error);
    }
  }, [mountRef, isInitialized]);

  useEffect(() => {
    if (!isMountReady || !mountRef.current) {
      console.log('Camera setup waiting for mount...');
      return;
    }

    try {
      console.log('Setting up cameras...');
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      if (width <= 0 || height <= 0) {
        console.warn('Invalid mount dimensions for camera setup:', { width, height });
        return;
      }
      
      const aspect = width / height;

      try {
        const perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 0.01, 2000);
        perspectiveCameraRef.current = perspectiveCamera;
        perspectiveCamera.position.set(5, 5, 5);
        perspectiveCamera.lookAt(0, 0, 0);
        console.log('Perspective camera created');
      } catch (error) {
        console.error('Error creating perspective camera:', error);
        return;
      }

      try {
        const frustumSize = 10;
        const orthographicCamera = new THREE.OrthographicCamera(
          -frustumSize * aspect / 2, frustumSize * aspect / 2,
          frustumSize / 2, -frustumSize / 2,
          0.01, 2000
        );
        orthographicCameraRef.current = orthographicCamera;
        orthographicCamera.position.set(5, 5, 5);
        orthographicCamera.lookAt(0, 0, 0);
        console.log('Orthographic camera created');
      } catch (error) {
        console.error('Error creating orthographic camera:', error);
        return;
      }

      activeCameraRef.current = perspectiveCameraRef.current;
      setIsInitialized(true);
      
      console.log('Camera setup completed successfully');
    } catch (error) {
      console.error('Error in camera setup:', error);
      setIsInitialized(false);
    }
  }, [mountRef, isMountReady]);

  return {
    perspectiveCameraRef,
    orthographicCameraRef,
    activeCameraRef,
    isOrthographic,
    isInitialized,
    switchCamera: isInitialized ? switchCamera : null
  };
};
