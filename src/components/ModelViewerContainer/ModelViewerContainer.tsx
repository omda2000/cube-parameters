
import BoxViewer from '../BoxViewer';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  BoxDimensions, 
  ShadowQuality 
} from '../../types/model';

interface ModelViewerContainerProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  onFileUpload: (file: File) => void;
  onModelsChange: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
}

const ModelViewerContainer = ({
  dimensions,
  boxColor,
  objectName,
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  loadedModels,
  currentModel,
  onFileUpload,
  onModelsChange,
  onSceneReady
}: ModelViewerContainerProps) => {
  return (
    <div className="w-full h-full">
      <BoxViewer 
        dimensions={dimensions} 
        boxColor={boxColor}
        objectName={objectName}
        sunlight={sunlight}
        ambientLight={ambientLight}
        shadowQuality={shadowQuality}
        environment={environment}
        onFileUpload={onFileUpload}
        onModelsChange={onModelsChange}
        loadedModels={loadedModels}
        currentModel={currentModel}
        showPrimitives={true}
        onSceneReady={onSceneReady}
      />
    </div>
  );
};

export default ModelViewerContainer;
