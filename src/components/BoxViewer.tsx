
import ThreeViewer from './ThreeViewer';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel 
} from '../types/model';

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
