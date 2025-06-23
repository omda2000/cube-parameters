
import { useRef, useState, useEffect } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useTransformControls } from '../hooks/useTransformControls';
import { useMouseInteraction } from '../hooks/useMouseInteraction';

interface ThreeViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  showShadow: boolean;
  showEdges: boolean;
  boxColor: string;
  objectName: string;
  transformMode: 'translate' | 'rotate' | 'scale';
}

const ThreeViewer = ({ 
  dimensions, 
  showShadow, 
  showEdges, 
  boxColor, 
  objectName, 
  transformMode 
}: ThreeViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    planeRef
  } = useThreeScene(mountRef);

  const { boxRef, edgesRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    showEdges
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

  // Update shadow visibility
  useEffect(() => {
    if (!boxRef.current || !rendererRef.current) return;
    
    rendererRef.current.shadowMap.enabled = showShadow;
    if (boxRef.current) {
      boxRef.current.castShadow = showShadow;
    }
    if (planeRef.current) {
      planeRef.current.receiveShadow = showShadow;
    }
  }, [showShadow]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeViewer;
