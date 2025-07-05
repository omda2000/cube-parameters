
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useAnimationLoop = (
  scene: THREE.Scene | null,
  activeCamera: THREE.Camera | null,
  renderer: THREE.WebGLRenderer | null,
  labelRenderer: CSS2DRenderer | null,
  controls: OrbitControls | null
) => {
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!scene || !activeCamera || !renderer || !labelRenderer || !controls) return;

    // Animation loop
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (currentTime - lastTime >= frameInterval) {
        controls.update();
        renderer.render(scene, activeCamera);
        labelRenderer.render(scene, activeCamera);
        renderer.info.reset();
        lastTime = currentTime;
      }
    };
    animate(0);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [scene, activeCamera, renderer, labelRenderer, controls]);

  return {
    animationIdRef
  };
};
