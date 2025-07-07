
import { useRef, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderCalls: number;
}

export const useThreePerformance = (renderer: THREE.WebGLRenderer | null) => {
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    renderCalls: 0
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderCallsRef = useRef(0);

  const updateMetrics = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    
    frameCountRef.current++;
    
    // Update FPS every second
    if (deltaTime >= 1000) {
      metricsRef.current.fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      metricsRef.current.frameTime = deltaTime / frameCountRef.current;
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Update memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metricsRef.current.memoryUsage = memory.usedJSHeapSize / 1048576; // MB
    }

    // Update render calls
    metricsRef.current.renderCalls = renderCallsRef.current;
    renderCallsRef.current = 0;
  }, []);

  const incrementRenderCalls = useCallback(() => {
    renderCallsRef.current++;
  }, []);

  useEffect(() => {
    if (!renderer) return;

    // Override renderer.render to count calls
    const originalRender = renderer.render.bind(renderer);
    renderer.render = (scene: THREE.Scene, camera: THREE.Camera) => {
      incrementRenderCalls();
      return originalRender(scene, camera);
    };

    const intervalId = setInterval(updateMetrics, 100);

    return () => {
      clearInterval(intervalId);
      renderer.render = originalRender;
    };
  }, [renderer, updateMetrics, incrementRenderCalls]);

  return {
    metrics: metricsRef.current,
    updateMetrics
  };
};
