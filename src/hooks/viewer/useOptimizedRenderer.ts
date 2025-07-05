
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useOptimizedRenderer = (renderer: THREE.WebGLRenderer | null) => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!renderer) return;

    // Enhanced renderer settings for better performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Enable frustum culling for better performance
    renderer.sortObjects = true;
    renderer.info.autoReset = false;

    // Performance optimization: Reduce render calls when scene is static
    const originalRender = renderer.render.bind(renderer);
    let lastRenderTime = 0;
    const minRenderInterval = 16; // ~60fps cap

    renderer.render = (scene: THREE.Scene, camera: THREE.Camera) => {
      const now = performance.now();
      if (now - lastRenderTime >= minRenderInterval) {
        originalRender(scene, camera);
        lastRenderTime = now;
        frameCountRef.current++;
      }
    };

    return () => {
      renderer.render = originalRender;
    };
  }, [renderer]);

  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        const now = performance.now();
        const deltaTime = now - lastTimeRef.current;
        
        if (deltaTime >= 1000 && frameCountRef.current > 0) {
          const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
          console.log(`Renderer FPS: ${fps}, Frame Count: ${frameCountRef.current}`);
          
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    frameCount: frameCountRef.current
  };
};
