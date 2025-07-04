
import { useEffect, type RefObject } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useSceneResize = (
  mountRef: RefObject<HTMLDivElement>,
  perspectiveCameraRef: RefObject<THREE.PerspectiveCamera | null>,
  orthographicCameraRef: RefObject<THREE.OrthographicCamera | null>,
  rendererRef: RefObject<THREE.WebGLRenderer | null>,
  labelRendererRef: RefObject<CSS2DRenderer | null>,
  mountReady: boolean = false
) => {
  useEffect(() => {
    if (!mountReady || !mountRef.current) return;

    let attempts = 0;
    const maxAttempts = 50;
    let handleResize: (() => void) | null = null;

    const initResize = () => {
      const perspectiveCamera = perspectiveCameraRef.current;
      const orthographicCamera = orthographicCameraRef.current;
      const renderer = rendererRef.current;
      const labelRenderer = labelRendererRef.current;
      if (!perspectiveCamera || !orthographicCamera || !renderer || !labelRenderer) {
        if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(initResize, 100);
        }
        return;
      }

      handleResize = () => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const aspect = width / height;

        // Update perspective camera
        perspectiveCamera.aspect = aspect;
        perspectiveCamera.updateProjectionMatrix();

        // Update orthographic camera
        const frustumSize = 10;
        orthographicCamera.left = -frustumSize * aspect / 2;
        orthographicCamera.right = frustumSize * aspect / 2;
        orthographicCamera.top = frustumSize / 2;
        orthographicCamera.bottom = -frustumSize / 2;
        orthographicCamera.updateProjectionMatrix();

        // Update renderers
        renderer.setSize(width, height);
        labelRenderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);
      handleResize();
    };

    initResize();

    return () => {
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [mountRef, perspectiveCameraRef, orthographicCameraRef, rendererRef, labelRendererRef, mountReady]);
};
