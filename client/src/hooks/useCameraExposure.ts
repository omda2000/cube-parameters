
import { useEffect } from 'react';

export const useCameraExposure = (switchCamera: (orthographic: boolean) => void) => {
  // Expose camera switching globally
  useEffect(() => {
    (window as any).__switchCameraMode = switchCamera;
    return () => {
      delete (window as any).__switchCameraMode;
    };
  }, [switchCamera]);
};
