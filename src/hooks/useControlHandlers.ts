
import { useCallback } from 'react';
import { useUIState } from '../store/useAppStore';

export const useControlHandlers = () => {
  const { 
    activeControlTab, 
    showControlPanel, 
    isOrthographic,
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
    const newOrthographic = orthographic !== undefined ? orthographic : !isOrthographic;
    setIsOrthographic(newOrthographic);
    
    // Log for debugging
    console.log('Camera toggle:', { newOrthographic, currentOrthographic: isOrthographic });
    
    // Use the exposed camera switch function
    const switchCameraMode = (window as any).__switchCameraMode;
    if (switchCameraMode && typeof switchCameraMode === 'function') {
      console.log('Using window.__switchCameraMode');
      switchCameraMode(newOrthographic);
    } else {
      console.log('Dispatching toggleCameraType event');
      // Fallback: dispatch a custom event that the Three.js component can listen to
      window.dispatchEvent(new CustomEvent('toggleCameraType', { 
        detail: { orthographic: newOrthographic } 
      }));
    }
  }, [isOrthographic, setIsOrthographic]);

  return {
    handleTabChange,
    handleCameraToggle
  };
};
