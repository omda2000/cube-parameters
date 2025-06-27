
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
