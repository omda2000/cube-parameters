
import ThreeViewer from './ThreeViewer';

interface SunlightSettings {
  intensity: number;
  azimuth: number;
  elevation: number;
  color: string;
  castShadow: boolean;
}

interface AmbientLightSettings {
  intensity: number;
  color: string;
}

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
}

interface BoxViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  boxColor: string;
  objectName: string;
  transformMode: 'translate' | 'rotate' | 'scale';
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: 'low' | 'medium' | 'high';
  environment: EnvironmentSettings;
}

const BoxViewer = ({ 
  dimensions, 
  boxColor, 
  objectName, 
  transformMode,
  sunlight,
  ambientLight,
  shadowQuality,
  environment
}: BoxViewerProps) => {
  return (
    <ThreeViewer
      dimensions={dimensions}
      boxColor={boxColor}
      objectName={objectName}
      transformMode={transformMode}
      sunlight={sunlight}
      ambientLight={ambientLight}
      shadowQuality={shadowQuality}
      environment={environment}
    />
  );
};

export default BoxViewer;
