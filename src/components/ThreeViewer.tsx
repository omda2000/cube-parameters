
import React, { useRef, useState } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useLighting } from '../hooks/useLighting';
import { useEnvironment } from '../hooks/useEnvironment';
import { useFBXLoader } from '../hooks/useFBXLoader';
import ObjectDataOverlay from './ObjectDataOverlay';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../types/model';

interface ThreeViewerProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  showPrimitives?: boolean;
}

const ThreeViewer = ({ 
  dimensions, 
  boxColor, 
  objectName, 
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  onModelsChange,
  showPrimitives = true
}: ThreeViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef
  } = useThreeScene(mountRef);

  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    showPrimitives
  );

  // Mark box as primitive for scene tree
  React.useEffect(() => {
    if (boxRef.current) {
      boxRef.current.userData.isPrimitive = true;
    }
  }, [boxRef.current]);

  const {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  } = useFBXLoader(sceneRef.current);

  // Expose models to parent component
  React.useEffect(() => {
    if (onModelsChange) {
      onModelsChange(loadedModels, currentModel);
    }
  }, [loadedModels, currentModel, onModelsChange]);

  // Expose FBX handlers globally for parent components to access
  React.useEffect(() => {
    (window as any).__fbxUploadHandler = loadFBXModel;
    (window as any).__fbxSwitchHandler = switchToModel;
    (window as any).__fbxRemoveHandler = removeModel;

    return () => {
      delete (window as any).__fbxUploadHandler;
      delete (window as any).__fbxSwitchHandler;
      delete (window as any).__fbxRemoveHandler;
    };
  }, [loadFBXModel, switchToModel, removeModel]);

  // Mouse interaction and hover effects
  const { objectData, mousePosition, isHovering } = useMouseInteraction(
    rendererRef.current,
    cameraRef.current,
    currentModel ? currentModel.object : boxRef.current,
    sceneRef.current
  );

  useLighting(
    sceneRef.current,
    sunlight,
    ambientLight,
    shadowQuality
  );

  useEnvironment(
    sceneRef.current,
    environment,
    gridHelperRef.current
  );

  // Update box visibility based on current model and showPrimitives
  React.useEffect(() => {
    if (boxRef.current) {
      boxRef.current.visible = showPrimitives && !currentModel;
    }
  }, [showPrimitives, currentModel]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      <ObjectDataOverlay 
        objectData={objectData}
        mousePosition={mousePosition}
        visible={isHovering}
      />
    </div>
  );
};

export default ThreeViewer;
