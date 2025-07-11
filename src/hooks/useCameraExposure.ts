
import { useEffect } from 'react';

export const useCameraExposure = (switchCamera: ((orthographic: boolean) => void) | null) => {
  // Expose camera switching globally with null safety
  useEffect(() => {
    // Only expose if switchCamera function is available
    if (typeof switchCamera === 'function') {
      try {
        (window as any).__switchCameraMode = switchCamera;
        
        // Add error handling for global calls
        (window as any).__switchCameraModeWithErrorHandling = (orthographic: boolean) => {
          try {
            switchCamera(orthographic);
          } catch (error) {
            console.error('Error switching camera mode:', error);
          }
        };
        
        return () => {
          try {
            delete (window as any).__switchCameraMode;
            delete (window as any).__switchCameraModeWithErrorHandling;
          } catch (error) {
            console.warn('Error cleaning up camera exposure:', error);
          }
        };
      } catch (error) {
        console.error('Error setting up camera exposure:', error);
      }
    }
    
    // No cleanup needed if switchCamera is null
    return () => {};
  }, [switchCamera]);
};
