
import { useRef, useCallback, useState, useEffect, type RefObject } from 'react';
import { ResourceManager } from './utils/ResourceManager';
import { useThreePerformance } from './useThreePerformance';
import { useSceneSetup } from './scene/useSceneSetup';
import { useCameraSetup } from './scene/useCameraSetup';
import { useRendererSetup } from './scene/useRendererSetup';
import { useControlsSetup } from './scene/useControlsSetup';
import { useSceneResize } from './scene/useSceneResize';
import { useAnimationLoop } from './scene/useAnimationLoop';

export const useThreeScene = (mountRef: RefObject<HTMLDivElement>) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [mountReady, setMountReady] = useState(false);
  const resourceManagerRef = useRef<ResourceManager>(ResourceManager.getInstance());

  // Wait for mount element to be ready
  useEffect(() => {
    const checkMount = () => {
      if (mountRef.current) {
        console.log('useThreeScene: Mount element is ready');
        setMountReady(true);
      } else {
        console.log('useThreeScene: Mount element not ready, retrying...');
        // Retry after a short delay
        setTimeout(checkMount, 100);
      }
    };

    checkMount();
  }, [mountRef]);

  console.log('useThreeScene: Initializing with mountRef ready:', mountReady);

  // Only initialize scene components when mount is ready
  const { sceneRef, ucsHelperRef, gridHelperRef } = useSceneSetup();
  
  const { 
    perspectiveCameraRef, 
    orthographicCameraRef, 
    activeCameraRef, 
    isOrthographic, 
    switchCamera: baseSwitchCamera 
  } = useCameraSetup(mountRef, mountReady);
  
  const { rendererRef, labelRendererRef } = useRendererSetup(mountRef, mountReady);
  
  const { controlsRef } = useControlsSetup(
    perspectiveCameraRef,
    rendererRef,
    mountReady
  );

  // Enhanced switch camera with controls reference
  const switchCamera = useCallback((orthographic: boolean) => {
    try {
      if (controlsRef.current) {
        baseSwitchCamera(orthographic, controlsRef);
      } else {
        console.warn('Controls not initialized yet, deferring camera switch');
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      setInitError('Failed to switch camera mode');
    }
  }, [baseSwitchCamera, controlsRef]);

  // Set up resize handling with error handling
  useSceneResize(
    mountRef,
    perspectiveCameraRef,
    orthographicCameraRef,
    rendererRef,
    labelRendererRef,
    mountReady
  );

  // Set up animation loop with error handling
  useAnimationLoop(
    sceneRef,
    activeCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    mountReady
  );

  // Performance monitoring
  const { metrics } = useThreePerformance(rendererRef);

  // Check initialization status with polling to avoid stale refs
  useEffect(() => {
    if (!mountReady) return;

    let attempts = 0;
    const maxAttempts = 50; // ~5 seconds at 100ms interval

    const interval = setInterval(() => {
      try {
        const hasScene = !!sceneRef.current;
        const hasCamera = !!activeCameraRef.current;
        const hasRenderer = !!rendererRef.current;
        const hasControls = !!controlsRef.current;

        if (hasScene && hasCamera && hasRenderer && hasControls) {
          setIsInitialized(true);
          setInitError(null);
          console.log('useThreeScene: Successfully initialized');
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          console.error('useThreeScene: Initialization timed out');
          setInitError('Failed to initialize Three.js scene');
          clearInterval(interval);
        }

        attempts += 1;
      } catch (error) {
        console.error('Error checking initialization status:', error);
        setInitError('Failed to initialize Three.js scene');
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [mountReady]);

  return {
    sceneRef,
    cameraRef: activeCameraRef,
    perspectiveCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics: metrics,
    isOrthographic,
    switchCamera,
    isInitialized,
    initError
  };
};
