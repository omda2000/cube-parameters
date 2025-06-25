
import BoxViewer from '../BoxViewer';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  BoxDimensions, 
  ShadowQuality 
} from '../../types/model';
import * as THREE from 'three';

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
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
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
  onSceneReady,
  activeTool,
  onPointCreate,
  onMeasureCreate
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
        activeTool={activeTool}
        onPointCreate={onPointCreate}
        onMeasureCreate={onMeasureCreate}
      />
    </div>
  );
};

export default ModelViewerContainer;
