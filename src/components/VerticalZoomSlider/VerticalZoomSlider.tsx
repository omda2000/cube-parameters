
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface VerticalZoomSliderProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const VerticalZoomSlider = ({ zoomLevel, onZoomChange, onZoomIn, onZoomOut }: VerticalZoomSliderProps) => {
  return (
    <TooltipProvider>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 z-40">
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-24 flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Slider
                    value={[zoomLevel]}
                    onValueChange={([value]) => onZoomChange(value)}
                    min={10}
                    max={500}
                    step={10}
                    orientation="vertical"
                    className="h-20 w-4"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Zoom: {zoomLevel}%</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <div className="text-xs text-slate-400 mt-1 text-center">
            {zoomLevel}%
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VerticalZoomSlider;
