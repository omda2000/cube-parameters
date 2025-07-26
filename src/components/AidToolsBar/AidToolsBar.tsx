
import React from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from 'lucide-react';
import { 
  RibbonMenu, 
  RibbonTab, 
  RibbonButton, 
  RibbonIconButton, 
  RibbonToolButton,
  RibbonButtonGroup,
  RibbonDropdown,
  RibbonDropdownMenu,
  RibbonDropdownItem,
  RibbonSplitButton
} from '@metroui/ribbon-menu';
import NotificationBell from '@/components/NotificationBell/NotificationBell';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure') => void;
  activeTool: 'select' | 'point' | 'measure';
  onViewFront?: () => void;
  onViewBack?: () => void;
  onViewLeft?: () => void;
  onViewRight?: () => void;
  onViewIsometric?: () => void;
  onToggle3DRotate?: () => void;
  isOrthographic?: boolean;
  onCameraToggle?: () => void;
  onZoomAll?: () => void;
  onZoomToSelected?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  selectedObject?: any;
  zoomLevel?: number;
}

const AidToolsBar = ({
  onToolSelect,
  activeTool,
  onViewFront,
  onViewBack,
  onViewLeft,
  onViewRight,
  onViewIsometric,
  onToggle3DRotate,
  isOrthographic = false,
  onCameraToggle,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedObject,
  zoomLevel = 100
}: AidToolsBarProps) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
      <RibbonMenu>
        {/* Home Tab - Main Tools */}
        <RibbonTab label="Home">
          <RibbonButtonGroup>
            <RibbonButton 
              caption="Select" 
              icon={<Target className="w-5 h-5" />}
              onClick={() => onToolSelect('select')}
              title="Select Tool"
              className={activeTool === 'select' ? 'bg-primary text-primary-foreground' : ''}
            />
            <RibbonButton 
              caption="Point" 
              icon={<MapPin className="w-5 h-5" />}
              onClick={() => onToolSelect('point')}
              title="Point Tool - Click to add points"
              className={activeTool === 'point' ? 'bg-primary text-primary-foreground' : ''}
            />
            <RibbonButton 
              caption="Measure" 
              icon={<Ruler className="w-5 h-5" />}
              onClick={() => onToolSelect('measure')}
              title="Measure Tool"
              className={activeTool === 'measure' ? 'bg-primary text-primary-foreground' : ''}
            />
          </RibbonButtonGroup>
        </RibbonTab>

        {/* View Tab - View Controls */}
        <RibbonTab label="View">
          <RibbonButtonGroup>
            <RibbonIconButton 
              caption="Left" 
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={onViewLeft}
              title="Left View"
            />
            <RibbonIconButton 
              caption="Right" 
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={onViewRight}
              title="Right View"
            />
            <RibbonIconButton 
              caption="Isometric" 
              icon={<Box className="w-4 h-4" />}
              onClick={onViewIsometric}
              title="Isometric View (I)"
            />
          </RibbonButtonGroup>

          <RibbonButtonGroup>
            <RibbonButton 
              caption="Zoom All" 
              icon={<Maximize className="w-5 h-5" />}
              onClick={onZoomAll}
              title="Zoom All (A)"
            />
            <RibbonButton 
              caption="Focus" 
              icon={<Focus className="w-5 h-5" />}
              onClick={onZoomToSelected}
              disabled={!selectedObject}
              title="Focus Selected (F)"
            />
            <RibbonIconButton 
              caption="Zoom In" 
              icon={<ZoomIn className="w-4 h-4" />}
              onClick={onZoomIn}
              title="Zoom In"
            />
            <RibbonIconButton 
              caption="Zoom Out" 
              icon={<ZoomOut className="w-4 h-4" />}
              onClick={onZoomOut}
              title="Zoom Out"
            />
            <RibbonIconButton 
              caption="Reset" 
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={onResetView}
              title="Reset View (R)"
            />
          </RibbonButtonGroup>

          {onCameraToggle && (
            <RibbonButtonGroup>
              <RibbonButton 
                caption={isOrthographic ? "Perspective" : "Orthographic"} 
                icon={<Camera className="w-5 h-5" />}
                onClick={onCameraToggle}
                title={`Toggle ${isOrthographic ? 'Perspective' : 'Orthographic'} Camera`}
                className={isOrthographic ? 'bg-primary text-primary-foreground' : ''}
              />
            </RibbonButtonGroup>
          )}

          <div className="flex items-center px-2 text-xs text-muted-foreground">
            Zoom: {zoomLevel}%
          </div>
        </RibbonTab>

        {/* Settings Tab */}
        <RibbonTab label="Settings">
          <RibbonButtonGroup>
            <NotificationBell />
          </RibbonButtonGroup>
        </RibbonTab>
      </RibbonMenu>
    </div>
  );
};

export default AidToolsBar;
