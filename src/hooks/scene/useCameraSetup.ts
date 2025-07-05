
import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

export const useCameraSetup = (mountRef: React.RefObject<HTMLDivElement>) => {
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  const [isOrthographic, setIsOrthographic] = useState(false);

  const switchCamera = useCallback((orthographic: boolean, controlsRef?: React.RefObject<any>) => {
    if (!mountRef.current || !controlsRef?.current) return;

    const controls = controlsRef.current;
    const currentPosition = controls.object.position.clone();
    const currentTarget = controls.target.clone();

    if (orthographic && orthographicCameraRef.current) {
      // Switch to orthographic
      const orthoCamera = orthographicCameraRef.current;
      orthoCamera.position.copy(currentPosition);
      orthoCamera.lookAt(currentTarget);
      
      controls.object = orthoCamera;
      activeCameraRef.current = orthoCamera;
      setIsOrthographic(true);
    } else if (!orthographic && perspectiveCameraRef.current) {
      // Switch to perspective
      const perspCamera = perspectiveCameraRef.current;
      perspCamera.position.copy(currentPosition);
      perspCamera.lookAt(currentTarget);
      
      controls.object = perspCamera;
      activeCameraRef.current = perspCamera;
      setIsOrthographic(false);
    }

    controls.target.copy(currentTarget);
    controls.update();
  }, [mountRef]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const aspect = width / height;

    // Perspective Camera setup
    const perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 0.01, 2000);
    perspectiveCameraRef.current = perspectiveCamera;
    perspectiveCamera.position.set(5, 5, 5);
    perspectiveCamera.lookAt(0, 0, 0);

    // Orthographic Camera setup
    const frustumSize = 10;
    const orthographicCamera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, frustumSize * aspect / 2,
      frustumSize / 2, -frustumSize / 2,
      0.01, 2000
    );
    orthographicCameraRef.current = orthographicCamera;
    orthographicCamera.position.set(5, 5, 5);
    orthographicCamera.lookAt(0, 0, 0);

    // Set initial active camera
    activeCameraRef.current = perspectiveCamera;
  }, [mountRef]);

  return {
    perspectiveCameraRef,
    orthographicCameraRef,
    activeCameraRef,
    isOrthographic,
    switchCamera
  };
};
