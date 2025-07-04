import React, { useRef, useEffect } from 'react';
import ThreeViewer from '../ThreeViewer';
import type { LoadedModel } from '../../types/model';
import * as THREE from 'three';

interface ModelViewerContainerProps {
  dimensions: { length: number; width: number; height: number };
  boxColor: string;
  objectName: string;
  sunlight: any;
  ambientLight: any;
  shadowQuality: 'low' | 'medium' | 'high';
  environment: any;
  loadedModels?: LoadedModel[];
  currentModel?: LoadedModel | null;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ModelViewerContainer = (props: ModelViewerContainerProps) => {
  return (
    <div className="flex-1 relative">
      <ThreeViewer {...props} />
    </div>
  );
};

export default ModelViewerContainer;