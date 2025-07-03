
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
  
  try {
    const { setShowControlPanel } = useUIState();
    console.log('useUIState hook loaded successfully');
    
    const { measurements, addMeasurement } = useMeasurements();
    console.log('useMeasurements hook loaded successfully');
    
    const { 
      handleZoomAll, 
      handleZoomToSelected, 
      handleResetView 
    } = useZoomHandlers();
    console.log('useZoomHandlers hook loaded successfully');

    const { handlePointCreate, handleMeasureCreate } = useToolHandlers(
      () => {}, // setActiveTool handled in UIContainer
      () => {}, // setShowMeasurePanel handled in UIContainer  
      addMeasurement
    );
    console.log('useToolHandlers hook loaded successfully');

    useKeyboardShortcuts({
      onToggleControlPanel: () => setShowControlPanel(true),
      onZoomAll: handleZoomAll,
      onZoomToSelected: handleZoomToSelected,
      onResetView: handleResetView
    });
    console.log('useKeyboardShortcuts hook loaded successfully');

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
  } catch (error) {
    console.error('Error in IndexContent:', error);
    return (
      <div className="w-full h-full bg-red-500 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">IndexContent Error</h2>
          <p className="mb-4">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
};

export default IndexContent;
