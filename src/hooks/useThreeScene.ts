
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
  const resourceManagerRef = useRef<ResourceManager>(ResourceManager.getInstance());

  console.log('useThreeScene: Initializing with mountRef:', !!mountRef.current);

  // Set up scene components with error handling
  const { sceneRef, ucsHelperRef, gridHelperRef } = useSceneSetup();
  
  const { 
    perspectiveCameraRef, 
    orthographicCameraRef, 
    activeCameraRef, 
    isOrthographic, 
    switchCamera: baseSwitchCamera 
  } = useCameraSetup(mountRef);
  
  const { rendererRef, labelRendererRef } = useRendererSetup(mountRef);
  
  const { controlsRef } = useControlsSetup(
    perspectiveCameraRef.current, 
    rendererRef.current
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
    labelRendererRef.current
  );

  // Set up animation loop with error handling
  useAnimationLoop(
    sceneRef.current,
    activeCameraRef.current,
    rendererRef.current,
    labelRendererRef.current,
    controlsRef.current
  );

  // Performance monitoring
  const { metrics } = useThreePerformance(rendererRef);

  // Check initialization status
  useEffect(() => {
    try {
      const hasScene = !!sceneRef.current;
      const hasCamera = !!activeCameraRef.current;
      const hasRenderer = !!rendererRef.current;
      const hasControls = !!controlsRef.current;
      
      console.log('useThreeScene: Checking initialization status', {
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
  }, [sceneRef.current, activeCameraRef.current, rendererRef.current, controlsRef.current]);

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
