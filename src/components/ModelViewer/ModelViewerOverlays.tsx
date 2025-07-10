
import React, { memo } from 'react';
import * as THREE from 'three';
import ObjectDataOverlay from '../ObjectDataOverlay';
import SelectionOverlay from '../SelectionOverlay/SelectionOverlay';

interface ModelViewerOverlaysProps {
  objectData: any;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  selectedObjects: any[];
}

const ModelViewerOverlays = memo(({
  objectData,
  mousePosition,
  isHovering,
  selectedObjects
}: ModelViewerOverlaysProps) => {
  return (
    <>
      <ObjectDataOverlay 
        objectData={objectData}
        mousePosition={mousePosition}
        visible={isHovering}
      />
      <SelectionOverlay 
        selectedObject={selectedObjects.length > 0 ? selectedObjects[0] : null} 
      />
    </>
  );
});

ModelViewerOverlays.displayName = 'ModelViewerOverlays';

export default ModelViewerOverlays;
