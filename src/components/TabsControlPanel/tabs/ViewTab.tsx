
import ViewControls from '../../ViewControls';
import type { EnvironmentSettings } from '../../../types/model';

interface ViewTabProps {
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
}

const ViewTab = ({ environment, setEnvironment }: ViewTabProps) => {
  // Zoom control handlers
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
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    console.log('Zoom out');
  };

  const handleResetView = () => {
    console.log('Reset view');
  };

  return (
    <ViewControls 
      environment={environment}
      setEnvironment={setEnvironment}
      onZoomAll={handleZoomAll}
      onZoomToSelected={handleZoomToSelected}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onResetView={handleResetView}
    />
  );
};

export default ViewTab;
