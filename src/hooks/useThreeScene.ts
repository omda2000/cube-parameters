
import { useRef, useCallback, useState, useEffect } from 'react';
import { ResourceManager } from './utils/ResourceManager';
import { useThreePerformance } from './useThreePerformance';
import { useSceneSetup } from './scene/useSceneSetup';
import { useCameraSetup } from './scene/useCameraSetup';
import { useRendererSetup } from './scene/useRendererSetup';
import { useControlsSetup } from './scene/useControlsSetup';
import { useSceneResize } from './scene/useSceneResize';
import { useAnimationLoop } from './scene/useAnimationLoop';

export const useThreeScene = (mountRef: React.RefObject<HTMLDivElement>) => {
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
    perspectiveCameraRef.current, 
    rendererRef.current,
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
    perspectiveCameraRef.current,
    orthographicCameraRef.current,
    rendererRef.current,
    labelRendererRef.current,
    mountReady
  );

  // Set up animation loop with error handling
  useAnimationLoop(
    sceneRef.current,
    activeCameraRef.current,
    rendererRef.current,
    labelRendererRef.current,
    controlsRef.current,
    mountReady
  );

  // Performance monitoring
  const { metrics } = useThreePerformance(rendererRef);

  // Check initialization status
  useEffect(() => {
    if (!mountReady) return;

    try {
      const hasScene = !!sceneRef.current;
      const hasCamera = !!activeCameraRef.current;
      const hasRenderer = !!rendererRef.current;
      const hasControls = !!controlsRef.current;
      
      console.log('useThreeScene: Checking initialization status', {
        mountReady,
        hasScene,
        hasCamera,
        hasRenderer,
        hasControls
      });

      if (hasScene && hasCamera && hasRenderer && hasControls) {
        setIsInitialized(true);
        setInitError(null);
        console.log('useThreeScene: Successfully initialized');
      } else {
        console.log('useThreeScene: Still initializing...');
      }
    } catch (error) {
      console.error('Error checking initialization status:', error);
      setInitError('Failed to initialize Three.js scene');
    }
  }, [mountReady, sceneRef.current, activeCameraRef.current, rendererRef.current, controlsRef.current]);

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
