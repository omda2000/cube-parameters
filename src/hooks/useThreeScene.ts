
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

  // Set up scene components
  const { sceneRef, ucsHelperRef, gridHelperRef, updateAdaptiveGrid } = useSceneSetup();
  
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
    baseSwitchCamera(orthographic, controlsRef);
  }, [baseSwitchCamera, controlsRef]);

  // Set up resize handling
  useSceneResize(
    mountRef,
    perspectiveCameraRef.current,
    orthographicCameraRef.current,
    rendererRef.current,
    labelRendererRef.current
  );

  // Set up animation loop
  useAnimationLoop(
    sceneRef.current,
    activeCameraRef.current,
    rendererRef.current,
    labelRendererRef.current,
    controlsRef.current
  );

  // Performance monitoring
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
    switchCamera,
    updateAdaptiveGrid
  };
};
