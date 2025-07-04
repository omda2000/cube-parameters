
import { useRef, useEffect, type RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useAnimationLoop = (
  sceneRef: RefObject<THREE.Scene | null>,
  activeCameraRef: RefObject<THREE.Camera | null>,
  rendererRef: RefObject<THREE.WebGLRenderer | null>,
  labelRendererRef: RefObject<CSS2DRenderer | null>,
  controlsRef: RefObject<OrbitControls | null>,
  mountReady: boolean = false
) => {
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountReady) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const startLoop = () => {
      const scene = sceneRef.current;
      const activeCamera = activeCameraRef.current;
      const renderer = rendererRef.current;
      const labelRenderer = labelRendererRef.current;
      const controls = controlsRef.current;

      if (!scene || !activeCamera || !renderer || !labelRenderer || !controls) {
        if (!cancelled) setTimeout(startLoop, 100);
        return;
      }

      console.log('useAnimationLoop: Starting animation loop...');

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

      cleanup = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
      };
    };

    startLoop();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [sceneRef, activeCameraRef, rendererRef, labelRendererRef, controlsRef, mountReady]);

  return {
    animationIdRef
  };
};
