
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
  activeTool?: 'select' | 'point' | 'measure';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  loadedModels: LoadedModel[];
  loadFBXModel: (file: File) => Promise<void>;
  loadGLTFModel: (file: File) => Promise<void>;
  switchToModel: (modelId: string) => void;
  removeModel: (modelId: string) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  switchCamera: (orthographic: boolean) => void;
}

export const useModelViewerEffects = ({
  renderer,
  camera,
  scene,
  controls,
  currentModel,
  activeTool = 'select',
  onPointCreate,
  onMeasureCreate,
  loadedModels,
  loadFBXModel,
  loadGLTFModel,
  switchToModel,
  removeModel,
  onModelsChange,
  switchCamera
}: UseModelViewerEffectsProps) => {
  // Selection handling
  const { selectedObjects, clearSelection, handleObjectSelect } = useObjectSelection();

  // Selection visual effects
  const { cleanupSelection } = useSelectionEffects(selectedObjects);

  // Camera exposure
  useCameraExposure(switchCamera);

  // Models exposure with proper change detection
  useModelsExposure(
    loadedModels,
    currentModel,
    loadFBXModel,
    loadGLTFModel,
    switchToModel,
    removeModel,
    onModelsChange
  );

  // Tool handlers
  const { handlePointCreate, handleMeasureCreate } = useToolHandlersViewer(
    onPointCreate,
    onMeasureCreate
  );

  // Mouse interaction - use the current model's object if available
  const targetObject = currentModel ? currentModel.object : null;
  const { objectData, mousePosition, isHovering } = useMouseInteraction(
    renderer,
    camera,
    targetObject,
    scene,
    handleObjectSelect,
    activeTool,
    controls,
    handlePointCreate,
    handleMeasureCreate
  );

  return {
    objectData,
    mousePosition,
    isHovering,
    selectedObjects
  };
};
