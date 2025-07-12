
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

  // Enhanced object selection handler with logging
  const enhancedHandleObjectSelect = (object: THREE.Object3D | null, isMultiSelect = false) => {
    console.log('Enhanced object select called:', { 
      object: object?.name || object?.type, 
      isMultiSelect,
      hasSelectionContext: !!handleObjectSelect
    });
    
    if (handleObjectSelect) {
      handleObjectSelect(object, isMultiSelect);
    } else {
      console.warn('handleObjectSelect not available from selection context');
    }
  };

  // Selection visual effects
  useSelectionEffects(selectedObjects);

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

  // Mouse interaction - use the scene instead of just current model for broader interaction
  const mouseInteractionResult = useMouseInteraction(
    renderer,
    camera,
    scene, // Pass scene instead of currentModel.object for better object detection
    scene,
    enhancedHandleObjectSelect, // Use enhanced handler with logging
    activeTool,
    controls,
    handlePointCreate,
    handleMeasureCreate
  );

  // Debug logging for selection state
  useEffect(() => {
    console.log('Selection state changed:', {
      selectedCount: selectedObjects.length,
      selectedObjects: selectedObjects.map(obj => ({
        id: obj.id,
        name: obj.name,
        type: obj.type
      }))
    });
  }, [selectedObjects]);

  return {
    objectData: mouseInteractionResult.objectData,
    mousePosition: mouseInteractionResult.mousePosition,
    isHovering: mouseInteractionResult.isHovering,
    selectedObjects
  };
};
