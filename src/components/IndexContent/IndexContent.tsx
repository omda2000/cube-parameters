
import React from 'react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useMeasurements } from '../../hooks/useMeasurements';
import { useUIState } from '../../store/useAppStore';
import { useToolHandlers } from '../../hooks/useToolHandlers';
import { useZoomHandlers } from '../../hooks/useZoomHandlers';
import ModelViewerContainerWrapper from '../../containers/ModelViewerContainer';
import UIContainer from '../../containers/UIContainer';
import ErrorBoundary from '../ErrorBoundary';

const IndexContent = () => {
  console.log('IndexContent: Starting render...');
  
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

  console.log('IndexContent: About to render JSX...');

  return (
    <div className="absolute inset-0">
      {/* Full-screen canvas */}
      <ErrorBoundary>
        <ModelViewerContainerWrapper
          onPointCreate={handlePointCreate}
          onMeasureCreate={handleMeasureCreate}
        />
      </ErrorBoundary>

      {/* UI Overlay */}
      <ErrorBoundary>
        <UIContainer />
      </ErrorBoundary>
    </div>
  );
};

export default IndexContent;
