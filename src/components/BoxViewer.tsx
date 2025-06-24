
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
  showEdges: boolean;
}

interface LoadedModel {
  id: string;
  name: string;
  object: THREE.Group;
  boundingBox: THREE.Box3;
  size: number;
}

interface BoxViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: 'low' | 'medium' | 'high';
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  loadedModels?: LoadedModel[];
  currentModel?: LoadedModel | null;
  showPrimitives?: boolean;
}

const BoxViewer = ({ 
  dimensions, 
  boxColor, 
  objectName, 
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  onModelsChange,
  loadedModels,
  currentModel,
  showPrimitives
}: BoxViewerProps) => {
  return (
    <ThreeViewer
      dimensions={dimensions}
      boxColor={boxColor}
      objectName={objectName}
      sunlight={sunlight}
      ambientLight={ambientLight}
      shadowQuality={shadowQuality}
      environment={environment}
      onFileUpload={onFileUpload}
      onModelsChange={onModelsChange}
      showPrimitives={showPrimitives}
    />
  );
};

export default BoxViewer;
