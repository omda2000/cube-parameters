
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
  // ALWAYS call all hooks in the same order - no conditional hooks
  
  // Selection handling - always called first
  const { selectedObjects, clearSelection, handleObjectSelect } = useObjectSelection();

  // Enhanced object selection handler with logging - always defined
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

  // Selection visual effects - always called
  useSelectionEffects(selectedObjects);

  // Camera exposure - always called
  useCameraExposure(switchCamera);

  // Models exposure - always called
  useModelsExposure(
    loadedModels,
    currentModel,
    loadFBXModel,
    loadGLTFModel,
    switchToModel,
    removeModel,
    onModelsChange
  );

  // Tool handlers - always called
  const { handlePointCreate, handleMeasureCreate } = useToolHandlersViewer(
    onPointCreate,
    onMeasureCreate
  );

  // Mouse interaction - always called with safe defaults
  const mouseInteractionResult = useMouseInteraction(
    renderer,
    camera,
    currentModel?.object || null, // Pass the model object instead of scene
    scene,
    enhancedHandleObjectSelect, // Use enhanced handler with logging
    activeTool,
    controls,
    handlePointCreate,
    handleMeasureCreate
  );

  // Debug logging for selection state - always called
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

  // Return consistent object structure
  return {
    objectData: mouseInteractionResult?.objectData || null,
    mousePosition: mouseInteractionResult?.mousePosition || { x: 0, y: 0 },
    isHovering: mouseInteractionResult?.isHovering || false,
    selectedObjects
  };
};
