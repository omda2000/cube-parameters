
import React, { useRef, useEffect, memo } from 'react';
import ThreeViewerCore from './ThreeViewer/ThreeViewerCore';
import ModelViewerOverlays from './ModelViewer/ModelViewerOverlays';
import { useModelViewerCore } from '../hooks/useModelViewerCore';
import { useShadeType } from '../hooks/useShadeType';
import ExpandableShadeSelector from './ExpandableShadeSelector/ExpandableShadeSelector';
import * as THREE from 'three';
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
  onSceneReady?: (scene: THREE.Scene) => void;
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ThreeViewer = memo((props: ThreeViewerProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const { shadeType, setShadeType } = useShadeType(sceneRef);

  const {
    mountRef,
    objectData,
    mousePosition,
    isHovering,
    selectedObjects,
    isLoading,
    error,
    performanceMetrics
  } = useModelViewerCore(props);

  // Get scene reference from the core hook
  useEffect(() => {
    if (props.onSceneReady) {
      const checkScene = () => {
        const mountElement = mountRef.current;
        if (mountElement) {
          const canvas = mountElement.querySelector('canvas');
          if (canvas && (canvas as any).__scene) {
            sceneRef.current = (canvas as any).__scene;
          }
        }
      };
      
      const interval = setInterval(checkScene, 100);
      return () => clearInterval(interval);
    }
  }, [mountRef, props.onSceneReady]);

  return (
    <div className="relative w-full h-full">
      <ThreeViewerCore 
        {...props}
        camera={null}
        controls={null}
      />
      
      <ModelViewerOverlays
        objectData={objectData}
        mousePosition={mousePosition}
        isHovering={isHovering}
        selectedObjects={selectedObjects}
      />

      {/* Shading Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ExpandableShadeSelector
          currentShadeType={shadeType}
          onShadeTypeChange={setShadeType}
        />
      </div>
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
