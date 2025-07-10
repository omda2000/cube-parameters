
import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useSceneResize = (
  mountRef: React.RefObject<HTMLDivElement>,
  perspectiveCamera: THREE.PerspectiveCamera | null,
  orthographicCamera: THREE.OrthographicCamera | null,
  renderer: THREE.WebGLRenderer | null,
  labelRenderer: CSS2DRenderer | null
) => {
  const handleResize = useCallback(() => {
    if (!mountRef.current || !renderer || !labelRenderer) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const aspect = width / height;

    // Update perspective camera
    if (perspectiveCamera) {
      perspectiveCamera.aspect = aspect;
      perspectiveCamera.updateProjectionMatrix();
    }

    // Update orthographic camera
    if (orthographicCamera) {
      const frustumSize = 10;
      orthographicCamera.left = -frustumSize * aspect / 2;
      orthographicCamera.right = frustumSize * aspect / 2;
      orthographicCamera.top = frustumSize / 2;
      orthographicCamera.bottom = -frustumSize / 2;
      orthographicCamera.updateProjectionMatrix();
    }

    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);
  }, [mountRef, perspectiveCamera, orthographicCamera, renderer, labelRenderer]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return { handleResize };
};
