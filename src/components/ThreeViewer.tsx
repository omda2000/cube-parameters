
import { useRef, useState } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useTransformControls } from '../hooks/useTransformControls';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useLighting } from '../hooks/useLighting';
import { useEnvironment } from '../hooks/useEnvironment';

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
}

const ThreeViewer = ({ 
  dimensions, 
  boxColor, 
  objectName, 
  transformMode,
  sunlight,
  ambientLight,
  shadowQuality,
  environment
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
    objectName
  );

  const { transformControlsRef } = useTransformControls(
    sceneRef.current,
    cameraRef.current,
    rendererRef.current,
    controlsRef.current,
    transformMode,
    isSelected
  );

  useMouseInteraction(
    rendererRef.current,
    cameraRef.current,
    boxRef.current,
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
