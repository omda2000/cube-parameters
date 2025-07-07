
import React from 'react';
import ModelViewerOverlays from '../ModelViewer/ModelViewerOverlays';
import MobileNavigationControls from '../MobileNavigationControls/MobileNavigationControls';
import NavigationCube from '../NavigationCube/NavigationCube';
import { useResponsiveMode } from '../../hooks/useResponsiveMode';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeViewerOverlaysProps {
  objectData: any;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  selectedObjects: any[];
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomAll: () => void;
  onResetView: () => void;
}

const ThreeViewerOverlays = ({
  objectData,
  mousePosition,
  isHovering,
  selectedObjects,
  camera,
  controls,
  onZoomIn,
  onZoomOut,
  onZoomAll,
  onResetView
}: ThreeViewerOverlaysProps) => {
  const { isMobile } = useResponsiveMode();

  return (
    <>
      <ModelViewerOverlays
        objectData={objectData}
        mousePosition={mousePosition}
        isHovering={isHovering}
        selectedObjects={selectedObjects}
      />
      
      {/* Mobile-specific controls */}
      {isMobile && (
        <MobileNavigationControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onZoomAll={onZoomAll}
          onZoomToSelected={onZoomAll}
          onResetView={onResetView}
          hasSelection={selectedObjects.length > 0}
        />
      )}
      
      {/* Navigation Cube - always visible */}
      <NavigationCube
        camera={camera}
        controls={controls}
        size={isMobile ? 80 : 100}
      />
    </>
  );
};

export default ThreeViewerOverlays;
