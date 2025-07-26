
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
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 z-40 shadow-lg">
        <div className="flex gap-1">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('select')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'select' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Select Tool"
        >
          <Target className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'point' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('point')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'point' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Point Tool - Click to add points"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'measure' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('measure')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'measure' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Measure Tool"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        
        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* View Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewLeft}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Left View</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewRight}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Right View</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewIsometric}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <Box className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Isometric View (I)</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Zoom Controls - Always Visible */}
        <div ref={zoomContainerRef} className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomAll}
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom All (A)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomToSelected}
                disabled={!selectedObject}
                className="h-8 w-8 p-0 hover:bg-accent disabled:opacity-30"
              >
                <Focus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Focus Selected (F)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetView}
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset View (R)</p>
            </TooltipContent>
          </Tooltip>

          {/* Zoom level indicator */}
          <div className="flex items-center px-2 text-xs text-muted-foreground">
            {zoomLevel}%
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Camera Toggle */}
        {onCameraToggle && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isOrthographic ? "default" : "ghost"}
                size="sm"
                onClick={onCameraToggle}
                className="h-8 w-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle {isOrthographic ? 'Perspective' : 'Orthographic'} Camera</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Notification Bell */}
        <NotificationBell />
      </div>
    </div>
    </TooltipProvider>
  );
};

export default AidToolsBar;
