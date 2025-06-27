
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from 'lucide-react';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ShadeTypeSelector, { type ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
}

const BottomFloatingBar = ({
  objectCount = 1,
  gridEnabled = true,
  gridSpacing = "1m",
  units = "m",
  cursorPosition = { x: 0, y: 0 },
  zoomLevel = 100,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  shadeType,
  onShadeTypeChange
}: BottomFloatingBarProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 z-30">
        <div className="flex items-center justify-between text-xs text-gray-300">
          {/* Left section - Status information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Objects:</span>
              <span className="text-white font-medium">{objectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Grid:</span>
              <span className="text-white font-medium">
                {gridEnabled ? `ON (${gridSpacing})` : 'OFF'}
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Units:</span>
              <span className="text-white font-medium">{units}</span>
            </div>
          </div>
          
          {/* Center section - View controls */}
          <div className="flex items-center gap-1 px-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomAll}
                  className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <Maximize className="h-3.5 w-3.5" />
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
                  className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50 disabled:opacity-30"
                >
                  <Focus className="h-3.5 w-3.5" />
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
                  className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
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
                  className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
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
                  className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset View (R)</p>
              </TooltipContent>
            </Tooltip>

            <div className="h-4 w-px bg-gray-600 mx-2" />
            
            <ShadeTypeSelector
              currentShadeType={shadeType}
              onShadeTypeChange={onShadeTypeChange}
            />
          </div>
          
          {/* Right section - Coordinates and zoom */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">X:</span>
              <span className="text-white font-medium">{cursorPosition.x.toFixed(2)}</span>
              <span className="text-gray-400 ml-2">Y:</span>
              <span className="text-white font-medium">{cursorPosition.y.toFixed(2)}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Zoom:</span>
              <span className="text-white font-medium">{zoomLevel}%</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BottomFloatingBar;
