
import BoxViewer from '../BoxViewer';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  BoxDimensions, 
  TransformMode, 
  ShadowQuality 
} from '../../types/model';

interface ModelViewerContainerProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  transformMode: TransformMode;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  onFileUpload: (file: File) => void;
  onModelsChange: (models: LoadedModel[], current: LoadedModel | null) => void;
}

const ModelViewerContainer = ({
  dimensions,
  boxColor,
  objectName,
  transformMode,
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  loadedModels,
  currentModel,
  onFileUpload,
  onModelsChange
}: ModelViewerContainerProps) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)]">
      <BoxViewer 
        dimensions={dimensions} 
        boxColor={boxColor}
        objectName={objectName}
        transformMode={transformMode}
        sunlight={sunlight}
        ambientLight={ambientLight}
        shadowQuality={shadowQuality}
        environment={environment}
        onFileUpload={onFileUpload}
        onModelsChange={onModelsChange}
        loadedModels={loadedModels}
        currentModel={currentModel}
        showPrimitives={!currentModel}
      />
    </div>
  );
};

export default ModelViewerContainer;
