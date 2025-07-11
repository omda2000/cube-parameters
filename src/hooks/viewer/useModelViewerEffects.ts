
import { useEffect } from 'react';
import { useObjectSelection } from '../useObjectSelection';
import { useSelectionEffects } from '../useSelectionEffects';
import { useMouseInteraction } from '../useMouseInteraction';
import { useCameraExposure } from '../useCameraExposure';
import { useModelsExposure } from '../useModelsExposure';
import { useToolHandlersViewer } from '../useToolHandlersViewer';
import type { LoadedModel } from '../../types/model';
import * as THREE from 'three';

interface UseModelViewerEffectsProps {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  controls: any;
  currentModel: LoadedModel | null;
  boxRef: React.RefObject<THREE.Mesh>;
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  loadedModels: LoadedModel[];
  loadFBXModel: (file: File) => Promise<void>;
  switchToModel: (modelId: string) => void;
  removeModel: (modelId: string) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  switchCamera: ((orthographic: boolean) => void) | null;
}

export const useModelViewerEffects = ({
  renderer,
  camera,
  scene,
  controls,
  currentModel,
  boxRef,
  activeTool = 'select',
  onPointCreate,
  onMeasureCreate,
  loadedModels,
  loadFBXModel,
  switchToModel,
  removeModel,
  onModelsChange,
  switchCamera
}: UseModelViewerEffectsProps) => {
  // Selection handling
  const { selectedObjects, clearSelection, handleObjectSelect } = useObjectSelection();

  // Selection visual effects
  useSelectionEffects(selectedObjects);

  // Camera exposure with null safety
  useCameraExposure(switchCamera);

  // Models exposure with proper change detection
  useModelsExposure(
    loadedModels,
    currentModel,
    loadFBXModel,
    switchToModel,
    removeModel,
    onModelsChange
  );

  // Tool handlers
  const { handlePointCreate, handleMeasureCreate } = useToolHandlersViewer(
    onPointCreate,
    onMeasureCreate
  );

  // Mouse interaction with enhanced validation
  const { objectData, mousePosition, isHovering } = useMouseInteraction(
    renderer,
    camera,
    currentModel ? currentModel.object : boxRef.current,
    scene,
    handleObjectSelect,
    activeTool,
    controls,
    handlePointCreate,
    handleMeasureCreate
  );

  // Add error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Model viewer error caught:', error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in model viewer:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return {
    objectData,
    mousePosition,
    isHovering,
    selectedObjects
  };
};
