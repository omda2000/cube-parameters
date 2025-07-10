
export const useZoomHandlers = () => {
  const handleZoomAll = () => {
    console.log('useZoomHandlers: handleZoomAll called');
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      console.log('useZoomHandlers: executing zoomAll');
      zoomControls.zoomAll();
    } else {
      console.log('useZoomHandlers: zoom controls not available');
    }
  };

  const handleZoomToSelected = () => {
    console.log('useZoomHandlers: handleZoomToSelected called');
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      console.log('useZoomHandlers: executing zoomToSelected');
      zoomControls.zoomToSelected();
    } else {
      console.log('useZoomHandlers: zoom controls not available');
    }
  };

  const handleZoomIn = () => {
    console.log('useZoomHandlers: handleZoomIn called');
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls && zoomControls.zoomIn) {
      console.log('useZoomHandlers: executing zoomIn');
      zoomControls.zoomIn();
    } else {
      console.log('useZoomHandlers: zoom controls not available');
    }
  };

  const handleZoomOut = () => {
    console.log('useZoomHandlers: handleZoomOut called');
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls && zoomControls.zoomOut) {
      console.log('useZoomHandlers: executing zoomOut');
      zoomControls.zoomOut();
    } else {
      console.log('useZoomHandlers: zoom controls not available');
    }
  };

  const handleResetView = () => {
    console.log('useZoomHandlers: handleResetView called');
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      console.log('useZoomHandlers: executing resetView');
      zoomControls.resetView();
    } else {
      console.log('useZoomHandlers: zoom controls not available');
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
