
export const useZoomHandlers = () => {
  const handleZoomAll = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      zoomControls.zoomAll();
    }
  };

  const handleZoomToSelected = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      zoomControls.zoomToSelected();
    }
  };

  const handleZoomIn = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls && zoomControls.zoomIn) {
      zoomControls.zoomIn();
    }
  };

  const handleZoomOut = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls && zoomControls.zoomOut) {
      zoomControls.zoomOut();
    }
  };

  const handleResetView = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      zoomControls.resetView();
    }
  };

  return {
    handleZoomAll,
    handleZoomToSelected,
    handleZoomIn,
    handleZoomOut,
    handleResetView
  };
};
