import { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../useThreeScene';
import { useBoxMesh } from '../useBoxMesh';
import { useFBXLoader } from '../useFBXLoader';
import { useObjectSelection } from '../useObjectSelection';
import { useCameraExposure } from '../useCameraExposure';
import { useModelsExposure } from '../useModelsExposure';
import { useToolHandlersViewer } from '../useToolHandlersViewer';
import type { 
  BoxDimensions,
  LoadedModel
} from '../../types/model';

interface UseModelViewerSetupProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  showPrimitives: boolean;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

export const useModelViewerSetup = ({
  dimensions,
  boxColor,
  objectName,
  showPrimitives,
  onModelsChange,
  onPointCreate,
  onMeasureCreate
}: UseModelViewerSetupProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Core Three.js scene setup
  const threeScene = useThreeScene(mountRef);
  const {
    sceneRef,
    perspectiveCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics,
    isOrthographic,
    switchCamera
  } = threeScene;

  // Box mesh setup
  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    showPrimitives
  );

  // FBX loader setup
  const fbxLoader = useFBXLoader(sceneRef.current);
  const {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  } = fbxLoader;

  // Object selection setup
  const objectSelection = useObjectSelection();
  const { selectedObjects, clearSelection, handleObjectSelect } = objectSelection;

  // Tool handlers setup
  const { handlePointCreate, handleMeasureCreate } = useToolHandlersViewer(
    onPointCreate,
    onMeasureCreate
  );

  // Expose functionality globally
  useCameraExposure(switchCamera);
  useModelsExposure(
    loadedModels,
    currentModel,
    loadFBXModel,
    switchToModel,
    removeModel,
    onModelsChange
  );

  return {
    // Refs
    mountRef,
    boxRef,
    
    // Three.js core
    ...threeScene,
    
    // FBX loader
    ...fbxLoader,
    
    // Object selection
    ...objectSelection,
    
    // Tool handlers
    handlePointCreate,
    handleMeasureCreate
  };
};