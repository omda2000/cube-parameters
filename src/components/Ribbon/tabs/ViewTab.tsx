import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { RibbonButton } from '../RibbonButton';
import { RibbonSeparator } from '../RibbonSeparator';
import { 
  Camera, 
  ArrowLeft, 
  ArrowRight, 
  Box,
  ZoomIn,
  ZoomOut,
  Maximize,
  Focus,
  RotateCcw
} from 'lucide-react';

interface ViewTabProps {
  isOrthographic: boolean;
  onCameraToggle: () => void;
  onViewChange: (view: string) => void;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({
  isOrthographic,
  onCameraToggle,
  onViewChange,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView
}) => {
  return (
    <>
      <RibbonGroup label="Camera">
        <RibbonButton
          icon={Camera}
          label={isOrthographic ? "Orthographic" : "Perspective"}
          size="large"
          onClick={onCameraToggle}
          tooltip="Toggle camera mode (C)"
        />
      </RibbonGroup>

      <RibbonGroup label="Standard Views">
        <RibbonButton
          icon={ArrowLeft}
          label="Left"
          size="medium"
          onClick={() => onViewChange('left')}
          tooltip="Left view"
        />
        <RibbonButton
          icon={ArrowRight}
          label="Right"
          size="medium"
          onClick={() => onViewChange('right')}
          tooltip="Right view"
        />
        <RibbonButton
          icon={Box}
          label="Isometric"
          size="medium"
          onClick={() => onViewChange('isometric')}
          tooltip="Isometric view"
        />
      </RibbonGroup>

      <RibbonGroup label="Zoom">
        <RibbonButton
          icon={Maximize}
          label="Zoom All"
          size="large"
          onClick={onZoomAll}
          tooltip="Zoom to fit all (F)"
        />
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <RibbonButton
              icon={Focus}
              size="small"
              onClick={onZoomToSelected}
              tooltip="Focus selected"
            />
            <RibbonButton
              icon={RotateCcw}
              size="small"
              onClick={onResetView}
              tooltip="Reset view"
            />
          </div>
          <div className="flex gap-1">
            <RibbonButton
              icon={ZoomIn}
              size="small"
              onClick={onZoomIn}
              tooltip="Zoom in (+)"
            />
            <RibbonButton
              icon={ZoomOut}
              size="small"
              onClick={onZoomOut}
              tooltip="Zoom out (-)"
            />
          </div>
        </div>
      </RibbonGroup>
    </>
  );
};