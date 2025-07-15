
import { useCallback } from 'react';
import { useUIState } from '../store/useAppStore';

export const useControlHandlers = () => {
  const { 
    activeControlTab, 
    showControlPanel, 
    setActiveControlTab, 
    setShowControlPanel, 
    setIsOrthographic 
  } = useUIState();

  const handleTabChange = useCallback((tabId: string) => {
    console.log('handleTabChange called with:', tabId, 'current:', activeControlTab, 'panelOpen:', showControlPanel);
    
    if (activeControlTab === tabId && showControlPanel) {
      setShowControlPanel(false);
    } else {
      setActiveControlTab(tabId);
      setShowControlPanel(true);
    }
  }, [activeControlTab, showControlPanel, setActiveControlTab, setShowControlPanel]);

  const handleCameraToggle = useCallback((orthographic?: boolean) => {
    const currentState = useUIState();
    const newOrthographic = orthographic !== undefined ? orthographic : !currentState.isOrthographic;
    setIsOrthographic(newOrthographic);
    
    // Try to access the camera controls from the window object
    const cameraControls = (window as any).__cameraControls;
    if (cameraControls && typeof cameraControls.toggleCameraType === 'function') {
      cameraControls.toggleCameraType(newOrthographic);
    } else {
      // Fallback: dispatch a custom event that the Three.js component can listen to
      window.dispatchEvent(new CustomEvent('toggleCameraType', { 
        detail: { orthographic: newOrthographic } 
      }));
    }
  }, [setIsOrthographic]);

  return {
    handleTabChange,
    handleCameraToggle
  };
};
