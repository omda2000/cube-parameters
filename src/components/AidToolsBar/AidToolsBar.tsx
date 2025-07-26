
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
        <div className="flex items-center justify-center px-6 py-3">
          <div className="flex items-stretch gap-8">
            
            {/* Tools Group */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-foreground/80 mb-2 tracking-wide uppercase">Tools</div>
              <div className="flex gap-1">
                <div className="flex flex-col items-center">
                  <Button
                    variant={activeTool === 'select' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onToolSelect('select')}
                    className={`h-14 w-18 flex-col gap-2 transition-all rounded-md border ${
                      activeTool === 'select' 
                        ? 'bg-primary text-primary-foreground shadow-sm border-primary/20' 
                        : 'text-foreground/70 hover:text-foreground hover:bg-accent/50 border-transparent hover:border-border/50'
                    }`}
                  >
                    <Target className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Select</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <Button
                    variant={activeTool === 'point' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onToolSelect('point')}
                    className={`h-14 w-18 flex-col gap-2 transition-all rounded-md border ${
                      activeTool === 'point' 
                        ? 'bg-primary text-primary-foreground shadow-sm border-primary/20' 
                        : 'text-foreground/70 hover:text-foreground hover:bg-accent/50 border-transparent hover:border-border/50'
                    }`}
                  >
                    <MapPin className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Point</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <Button
                    variant={activeTool === 'measure' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onToolSelect('measure')}
                    className={`h-14 w-18 flex-col gap-2 transition-all rounded-md border ${
                      activeTool === 'measure' 
                        ? 'bg-primary text-primary-foreground shadow-sm border-primary/20' 
                        : 'text-foreground/70 hover:text-foreground hover:bg-accent/50 border-transparent hover:border-border/50'
                    }`}
                  >
                    <Ruler className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Measure</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-px h-20 bg-border/60" />
            
            {/* Views Group */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-foreground/80 mb-2 tracking-wide uppercase">Views</div>
              <div className="flex gap-1">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewLeft}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <ArrowLeft className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Left</span>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewRight}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <ArrowRight className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Right</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewIsometric}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <Box className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">ISO</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-px h-20 bg-border/60" />
            
            {/* Zoom Group */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-foreground/80 mb-2 tracking-wide uppercase">Zoom</div>
              <div className="flex gap-1">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomAll}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <Maximize className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">All</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomToSelected}
                    disabled={!selectedObject}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 disabled:opacity-40 disabled:hover:bg-transparent transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <Focus className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Focus</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomIn}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <ZoomIn className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">In</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomOut}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <ZoomOut className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Out</span>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResetView}
                    className="h-14 w-16 flex-col gap-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all rounded-md border border-transparent hover:border-border/50"
                  >
                    <RotateCcw className="h-6 w-6" />
                    <span className="text-xs font-medium leading-tight">Reset</span>
                  </Button>
                </div>
              </div>
              
              {/* Zoom level indicator */}
              <div className="text-xs font-medium text-foreground/60 mt-2 bg-muted/30 px-2 py-0.5 rounded">
                {zoomLevel}%
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-20 bg-border/60" />

            {/* Camera Group */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-foreground/80 mb-2 tracking-wide uppercase">Camera</div>
              <div className="flex gap-1">
                {onCameraToggle && (
                  <div className="flex flex-col items-center">
                    <Button
                      variant={isOrthographic ? "default" : "ghost"}
                      size="sm"
                      onClick={onCameraToggle}
                      className={`h-14 w-18 flex-col gap-2 transition-all rounded-md border ${
                        isOrthographic
                          ? 'bg-primary text-primary-foreground shadow-sm border-primary/20'
                          : 'text-foreground/70 hover:text-foreground hover:bg-accent/50 border-transparent hover:border-border/50'
                      }`}
                    >
                      <Camera className="h-6 w-6" />
                      <span className="text-xs font-medium leading-tight">{isOrthographic ? 'Ortho' : 'Persp'}</span>
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
