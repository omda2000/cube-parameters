
import React from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import NotificationBell from '@/components/NotificationBell/NotificationBell';
import { RibbonMenu, RibbonTab, RibbonGroup, RibbonButton } from '@metroui/ribbon-menu';
import '@metroui/ribbon-menu/lib/ribbon-menu.css';

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
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <TooltipProvider>
          <RibbonMenu className="w-full min-h-[120px]" style={{ '--ribbon-height': '120px' }}>
            {/* Home Tab - Primary Tools */}
            <RibbonTab label="Home">
              <RibbonGroup label="Selection">
                <div className="flex flex-col gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RibbonButton
                        className={`flex flex-col items-center p-2 h-16 min-w-[60px] ${
                          activeTool === 'select' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                        onClick={() => onToolSelect('select')}
                      >
                        <Target className="h-6 w-6 mb-1" />
                        <span className="text-xs">Select</span>
                      </RibbonButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select Tool</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RibbonButton
                        className={`flex flex-col items-center p-2 h-16 min-w-[60px] ${
                          activeTool === 'point' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                        onClick={() => onToolSelect('point')}
                      >
                        <MapPin className="h-6 w-6 mb-1" />
                        <span className="text-xs">Point</span>
                      </RibbonButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Point Tool - Click to add points</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </RibbonGroup>

              <RibbonGroup label="Measure">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <RibbonButton
                      className={`flex flex-col items-center p-2 h-16 min-w-[60px] ${
                        activeTool === 'measure' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                      onClick={() => onToolSelect('measure')}
                    >
                      <Ruler className="h-6 w-6 mb-1" />
                      <span className="text-xs">Measure</span>
                    </RibbonButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Measure Tool</p>
                  </TooltipContent>
                </Tooltip>
              </RibbonGroup>
            </RibbonTab>

            {/* View Tab - All View Controls */}
            <RibbonTab label="View">
              <RibbonGroup label="Camera">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <RibbonButton
                      className={`flex flex-col items-center p-2 h-16 min-w-[60px] ${
                        isOrthographic ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                      onClick={onCameraToggle}
                    >
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-xs">{isOrthographic ? 'Ortho' : 'Persp'}</span>
                    </RibbonButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle {isOrthographic ? 'Perspective' : 'Orthographic'} Camera</p>
                  </TooltipContent>
                </Tooltip>
              </RibbonGroup>

              <RibbonGroup label="Standard Views">
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RibbonButton
                        className="flex flex-col items-center p-1 h-12 min-w-[50px] hover:bg-accent"
                        onClick={onViewLeft}
                      >
                        <ArrowLeft className="h-4 w-4 mb-1" />
                        <span className="text-xs">Left</span>
                      </RibbonButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Left View</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RibbonButton
                        className="flex flex-col items-center p-1 h-12 min-w-[50px] hover:bg-accent"
                        onClick={onViewRight}
                      >
                        <ArrowRight className="h-4 w-4 mb-1" />
                        <span className="text-xs">Right</span>
                      </RibbonButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Right View</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RibbonButton
                        className="flex flex-col items-center p-1 h-12 min-w-[50px] hover:bg-accent"
                        onClick={onViewIsometric}
                      >
                        <Box className="h-4 w-4 mb-1" />
                        <span className="text-xs">Iso</span>
                      </RibbonButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Isometric View (I)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </RibbonGroup>

              <RibbonGroup label="Zoom">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RibbonButton
                          className="flex flex-col items-center p-1 h-12 min-w-[45px] hover:bg-accent"
                          onClick={onZoomAll}
                        >
                          <Maximize className="h-4 w-4 mb-1" />
                          <span className="text-xs">Fit</span>
                        </RibbonButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom All (A)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RibbonButton
                          className="flex flex-col items-center p-1 h-12 min-w-[45px] hover:bg-accent disabled:opacity-30"
                          onClick={onZoomToSelected}
                          disabled={!selectedObject}
                        >
                          <Focus className="h-4 w-4 mb-1" />
                          <span className="text-xs">Focus</span>
                        </RibbonButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Focus Selected (F)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex gap-1 items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RibbonButton
                          className="flex items-center justify-center p-1 h-6 w-6 hover:bg-accent"
                          onClick={onZoomIn}
                        >
                          <ZoomIn className="h-3 w-3" />
                        </RibbonButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom In</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="text-xs text-muted-foreground min-w-[3rem] text-center px-1">
                      {Math.round(zoomLevel)}%
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RibbonButton
                          className="flex items-center justify-center p-1 h-6 w-6 hover:bg-accent"
                          onClick={onZoomOut}
                        >
                          <ZoomOut className="h-3 w-3" />
                        </RibbonButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom Out</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RibbonButton
                          className="flex items-center justify-center p-1 h-6 w-6 hover:bg-accent"
                          onClick={onResetView}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </RibbonButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset View (R)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </RibbonGroup>
            </RibbonTab>

            {/* Tools Tab - Additional Utilities */}
            <RibbonTab label="Tools">
              <RibbonGroup label="Utilities">
                <div className="flex items-center justify-center p-2">
                  <NotificationBell />
                </div>
              </RibbonGroup>
            </RibbonTab>
          </RibbonMenu>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AidToolsBar;
