
export const useControlHandlers = (
  activeControlTab: string,
  showControlPanel: boolean,
  setActiveControlTab: (tab: string) => void,
  setShowControlPanel: (show: boolean) => void,
  setIsOrthographic: (ortho: boolean) => void
) => {
  const handleTabChange = (tabId: string) => {
    if (activeControlTab === tabId && showControlPanel) {
      setShowControlPanel(false);
    } else {
      setActiveControlTab(tabId);
      setShowControlPanel(true);
    }
  };

  const handleCameraToggle = (orthographic: boolean) => {
    setIsOrthographic(orthographic);
    
    // Try to access the camera controls from the window object
    const cameraControls = (window as any).__cameraControls;
    if (cameraControls && typeof cameraControls.toggleCameraType === 'function') {
      cameraControls.toggleCameraType(orthographic);
    } else {
      // Fallback: dispatch a custom event that the Three.js component can listen to
      window.dispatchEvent(new CustomEvent('toggleCameraType', { 
        detail: { orthographic } 
      }));
    }
  };

  return {
    handleTabChange,
    handleCameraToggle
  };
};
