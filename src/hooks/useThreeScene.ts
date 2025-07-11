
import { useCallback } from 'react';
import { ResourceManager } from './utils/ResourceManager';
import { useThreePerformance } from './useThreePerformance';
import { useMountState } from './scene/useMountState';
import { useSceneSetup } from './scene/useSceneSetup';
import { useCameraSetup } from './scene/useCameraSetup';
import { useRendererSetup } from './scene/useRendererSetup';
import { useControlsSetup } from './scene/useControlsSetup';
import { useSceneResize } from './scene/useSceneResize';
import { useAnimationLoop } from './scene/useAnimationLoop';

export const useThreeScene = (providedMountRef?: React.RefObject<HTMLDivElement>) => {
  // Use our own mount state management or the provided ref
  const { mountRef, mountCallback, isMountReady } = useMountState();
  const actualMountRef = providedMountRef || mountRef;

  // Sequential initialization with proper dependencies
  const { sceneRef, ucsHelperRef, gridHelperRef, isSceneReady } = useSceneSetup(isMountReady);
  
  const { 
    perspectiveCameraRef, 
    orthographicCameraRef, 
    activeCameraRef, 
    isOrthographic, 
    isInitialized: isCameraReady,
    switchCamera: baseSwitchCamera 
  } = useCameraSetup(actualMountRef, isMountReady);
  
  const { rendererRef, labelRendererRef, isRendererReady } = useRendererSetup(actualMountRef, isMountReady);
  
  const { controlsRef, isControlsReady } = useControlsSetup(
    perspectiveCameraRef.current, 
    rendererRef.current,
    isCameraReady,
    isRendererReady
  );

  // Enhanced switch camera with proper validation
  const switchCamera = useCallback((orthographic: boolean) => {
    if (!baseSwitchCamera) {
      console.warn('Camera switch function not available');
      return;
    }
    
    if (!controlsRef.current) {
      console.warn('Controls not available for camera switch');
      return;
    }
    
    try {
      baseSwitchCamera(orthographic, controlsRef);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  }, [baseSwitchCamera, controlsRef]);

  // Set up resize handling - only when all components are ready
  useSceneResize(
    actualMountRef,
    isCameraReady ? perspectiveCameraRef.current : null,
    isCameraReady ? orthographicCameraRef.current : null,
    isRendererReady ? rendererRef.current : null,
    isRendererReady ? labelRendererRef.current : null
  );

  // Set up animation loop - only when all components are ready
  useAnimationLoop(
    isSceneReady ? sceneRef.current : null,
    isCameraReady ? activeCameraRef.current : null,
    isRendererReady ? rendererRef.current : null,
    isRendererReady ? labelRendererRef.current : null,
    isControlsReady ? controlsRef.current : null
  );

  // Performance monitoring
  const { metrics } = useThreePerformance(rendererRef.current);

  // Check if everything is ready
  const isFullyInitialized = isMountReady && isSceneReady && isCameraReady && isRendererReady && isControlsReady;

  console.log('Three.js initialization status:', {
    isMountReady,
    isSceneReady,
    isCameraReady,
    isRendererReady,
    isControlsReady,
    isFullyInitialized
  });

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
    switchCamera: isFullyInitialized ? switchCamera : null,
    mountCallback: providedMountRef ? undefined : mountCallback,
    isFullyInitialized
  };
};
