
import { useRef, useCallback } from 'react';
import { ResourceManager } from './utils/ResourceManager';
import { useThreePerformance } from './useThreePerformance';
import { useSceneSetup } from './scene/useSceneSetup';
import { useCameraSetup } from './scene/useCameraSetup';
import { useRendererSetup } from './scene/useRendererSetup';
import { useControlsSetup } from './scene/useControlsSetup';
import { useSceneResize } from './scene/useSceneResize';
import { useAnimationLoop } from './scene/useAnimationLoop';

export const useThreeScene = (mountRef: React.RefObject<HTMLDivElement>) => {
  const resourceManagerRef = useRef<ResourceManager>(ResourceManager.getInstance());

  // Set up scene components with proper error handling
  const { sceneRef, ucsHelperRef, gridHelperRef } = useSceneSetup();
  
  const { 
    perspectiveCameraRef, 
    orthographicCameraRef, 
    activeCameraRef, 
    isOrthographic, 
    isInitialized: cameraInitialized,
    switchCamera: baseSwitchCamera 
  } = useCameraSetup(mountRef);
  
  const { rendererRef, labelRendererRef } = useRendererSetup(mountRef);
  
  // Only set up controls when camera and renderer are available
  const { controlsRef } = useControlsSetup(
    cameraInitialized ? perspectiveCameraRef.current : null, 
    rendererRef.current
  );

  // Enhanced switch camera with proper validation
  const switchCamera = useCallback((orthographic: boolean) => {
    try {
      if (!baseSwitchCamera) {
        console.warn('Camera switch function not available');
        return;
      }
      
      if (!controlsRef.current) {
        console.warn('Controls not available for camera switch');
        return;
      }
      
      baseSwitchCamera(orthographic, controlsRef);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  }, [baseSwitchCamera, controlsRef]);

  // Set up resize handling with null checks
  useSceneResize(
    mountRef,
    perspectiveCameraRef.current,
    orthographicCameraRef.current,
    rendererRef.current,
    labelRendererRef.current
  );

  // Set up animation loop with null checks
  useAnimationLoop(
    sceneRef.current,
    activeCameraRef.current,
    rendererRef.current,
    labelRendererRef.current,
    controlsRef.current
  );

  // Performance monitoring with error handling
  const { metrics } = useThreePerformance(rendererRef.current);

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
    switchCamera: cameraInitialized ? switchCamera : null
  };
};
