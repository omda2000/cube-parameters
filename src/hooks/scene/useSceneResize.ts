
import { useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useSceneResize = (
  mountRef: React.RefObject<HTMLDivElement>,
  perspectiveCamera: THREE.PerspectiveCamera | null,
  orthographicCamera: THREE.OrthographicCamera | null,
  renderer: THREE.WebGLRenderer | null,
  labelRenderer: CSS2DRenderer | null,
  mountReady: boolean = false
) => {
  useEffect(() => {
    if (!mountRef.current || !perspectiveCamera || !orthographicCamera || !renderer || !labelRenderer || !mountReady) {
      return;
    }

    const handleResize = () => {
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
    
    // Initial resize
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mountRef, perspectiveCamera, orthographicCamera, renderer, labelRenderer, mountReady]);
};
