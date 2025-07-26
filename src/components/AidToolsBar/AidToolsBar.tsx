
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
  // Always show zoom controls expanded
  const isZoomExpanded = true;
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  return (
    <TooltipProvider>
      <div className="fixed top-0 left-0 right-0 bg-card/98 backdrop-blur-sm border-b border-border z-40 shadow-sm">
        <div className="flex items-center justify-center px-4 py-2">
          <div className="flex items-center gap-6">
            
            {/* Tools Group */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">Tools</div>
              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <Button
                    variant={activeTool === 'select' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onToolSelect('select')}
                    className={`h-12 w-16 flex-col gap-1 transition-all ${
                      activeTool === 'select' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Target className="h-5 w-5" />
                    <span className="text-xs">Select</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <Button
                    variant={activeTool === 'point' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onToolSelect('point')}
                    className={`h-12 w-16 flex-col gap-1 transition-all ${
                      activeTool === 'point' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs">Point</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <Button
                    variant={activeTool === 'measure' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onToolSelect('measure')}
                    className={`h-12 w-16 flex-col gap-1 transition-all ${
                      activeTool === 'measure' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Ruler className="h-5 w-5" />
                    <span className="text-xs">Measure</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-px h-16 bg-border" />
            
            {/* Views Group */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">Views</div>
              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewLeft}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-xs">Left</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewRight}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <ArrowRight className="h-5 w-5" />
                    <span className="text-xs">Right</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewIsometric}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <Box className="h-5 w-5" />
                    <span className="text-xs">ISO</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-px h-16 bg-border" />
            
            {/* Zoom Group */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">Zoom</div>
              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomAll}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <Maximize className="h-5 w-5" />
                    <span className="text-xs">All</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomToSelected}
                    disabled={!selectedObject}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent disabled:opacity-30"
                  >
                    <Focus className="h-5 w-5" />
                    <span className="text-xs">Focus</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomIn}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <ZoomIn className="h-5 w-5" />
                    <span className="text-xs">In</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomOut}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <ZoomOut className="h-5 w-5" />
                    <span className="text-xs">Out</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResetView}
                    className="h-12 w-16 flex-col gap-1 hover:bg-accent"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span className="text-xs">Reset</span>
                  </Button>
                </div>
              </div>
              
              {/* Zoom level indicator */}
              <div className="text-xs text-muted-foreground mt-1">
                {zoomLevel}%
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-16 bg-border" />

            {/* Camera Group */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">Camera</div>
              <div className="flex gap-2">
                {onCameraToggle && (
                  <div className="flex flex-col items-center">
                    <Button
                      variant={isOrthographic ? "default" : "ghost"}
                      size="sm"
                      onClick={onCameraToggle}
                      className="h-12 w-16 flex-col gap-1"
                    >
                      <Camera className="h-5 w-5" />
                      <span className="text-xs">{isOrthographic ? 'Ortho' : 'Persp'}</span>
                    </Button>
                  </div>
                )}
                
                {/* Notification Bell */}
                <div className="flex flex-col items-center">
                  <NotificationBell />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AidToolsBar;
