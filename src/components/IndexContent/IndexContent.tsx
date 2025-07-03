
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
  console.log('IndexContent rendering...');
  
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

  console.log('IndexContent about to render JSX...');

  return (
    <ErrorBoundary>
      {/* Full-screen canvas */}
      <div className="absolute inset-0">
        <ErrorBoundary fallback={<div className="w-full h-full bg-red-500 text-white flex items-center justify-center">Model Viewer Error</div>}>
          <ModelViewerContainerWrapper
            onPointCreate={handlePointCreate}
            onMeasureCreate={handleMeasureCreate}
          />
        </ErrorBoundary>
      </div>

      {/* UI Overlay */}
      <ErrorBoundary fallback={<div className="fixed top-4 left-4 bg-red-500 text-white p-4 rounded">UI Error</div>}>
        <UIContainer />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default IndexContent;
