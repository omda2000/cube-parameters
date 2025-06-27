
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from 'lucide-react';

interface VerticalZoomControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedObject?: any;
}

const VerticalZoomControls = ({
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedObject
}: VerticalZoomControlsProps) => {
  return (
    <TooltipProvider>
      <div className="fixed left-4 top-4 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-1 z-40 shadow-lg">
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomAll}
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
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
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50 disabled:opacity-30"
              >
                <Focus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Focus Selected (F)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="h-px bg-slate-600/50 my-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetView}
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Reset View (R)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VerticalZoomControls;
