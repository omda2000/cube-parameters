
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
    const cameraControls = (window as any).__cameraControls;
    if (cameraControls) {
      cameraControls.toggleCameraType(orthographic);
    }
  };

  return {
    handleTabChange,
    handleCameraToggle
  };
};
