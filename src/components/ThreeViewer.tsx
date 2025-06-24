
import { useRef, useState } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useTransformControls } from '../hooks/useTransformControls';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useLighting } from '../hooks/useLighting';
import { useEnvironment } from '../hooks/useEnvironment';
import { useFBXLoader } from '../hooks/useFBXLoader';

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

interface LoadedModel {
  id: string;
  name: string;
  object: THREE.Group;
  boundingBox: THREE.Box3;
  size: number;
}

interface ThreeViewerProps {
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
  onFileUpload?: (file: File) => void;
  loadedModels?: LoadedModel[];
  currentModel?: LoadedModel | null;
  showPrimitives?: boolean;
}

const ThreeViewer = ({ 
  dimensions, 
  boxColor, 
  objectName, 
  transformMode,
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  loadedModels = [],
  currentModel,
  showPrimitives = true
}: ThreeViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef
  } = useThreeScene(mountRef);

  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    showPrimitives && !currentModel
  );

  const {
    loadedModels: fbxModels,
    currentModel: fbxCurrentModel,
    isLoading: fbxLoading,
    error: fbxError,
    loadFBXModel,
    switchToModel,
    removeModel
  } = useFBXLoader(sceneRef.current);

  const { transformControlsRef } = useTransformControls(
    sceneRef.current,
    cameraRef.current,
    rendererRef.current,
    controlsRef.current,
    transformMode,
    isSelected
  );

  // Determine the active object for interaction
  const activeObject = currentModel ? currentModel.object : boxRef.current;

  useMouseInteraction(
    rendererRef.current,
    cameraRef.current,
    activeObject,
    transformControlsRef.current,
    isSelected,
    setIsSelected,
    transformMode
  );

  useLighting(
    sceneRef.current,
    sunlight,
    ambientLight,
    shadowQuality
  );

  useEnvironment(
    sceneRef.current,
    environment
  );

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeViewer;
