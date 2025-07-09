
import React, { memo } from 'react';
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
  // Only show overlays when there's actual data to display
  const shouldShowObjectData = isHovering && objectData && mousePosition.x > 0 && mousePosition.y > 0;
  const shouldShowSelection = selectedObjects && selectedObjects.length > 0 && selectedObjects[0];

  return (
    <>
      {shouldShowObjectData && (
        <ObjectDataOverlay 
          objectData={objectData}
          mousePosition={mousePosition}
          visible={true}
        />
      )}
      {shouldShowSelection && (
        <SelectionOverlay 
          selectedObject={selectedObjects[0]} 
        />
      )}
    </>
  );
});

ModelViewerOverlays.displayName = 'ModelViewerOverlays';

export default ModelViewerOverlays;
