
import React from 'react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useMeasurements } from '../../hooks/useMeasurements';
import { useUIState } from '../../hooks/store/useUIState';
import { useToolHandlers } from '../../hooks/useToolHandlers';
import { useZoomHandlers } from '../../hooks/useZoomHandlers';
import ModelViewerContainerWrapper from '../../containers/ModelViewerContainer';
import UIContainer from '../../containers/UIContainer';

const IndexContent = () => {
  const { setShowControlPanel } = useUIState();
  const { measurements, addMeasurement } = useMeasurements();
  
  const { 
    handleZoomAll, 
    handleZoomToSelected, 
    handleResetView 
  } = useZoomHandlers();

  const { handlePointCreate, handleMeasureCreate } = useToolHandlers(
    () => {}, // setActiveTool handled in UIContainer
    () => {}, // setShowMeasurePanel handled in UIContainer  
    addMeasurement
  );

  useKeyboardShortcuts({
    onToggleControlPanel: () => setShowControlPanel(true),
    onZoomAll: handleZoomAll,
    onZoomToSelected: handleZoomToSelected,
    onResetView: handleResetView
  });

  return (
    <>
      {/* Full-screen canvas */}
      <div className="absolute inset-0">
        <ModelViewerContainerWrapper
          onPointCreate={handlePointCreate}
          onMeasureCreate={handleMeasureCreate}
        />
      </div>

      {/* UI Overlay */}
      <UIContainer />
    </>
  );
};

export default IndexContent;
