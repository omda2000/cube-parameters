
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';
import ExpandableViewControls from '../ExpandableViewControls/ExpandableViewControls';
import { Box } from 'lucide-react';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onResetView: () => void;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
  snapToVertex?: boolean;
  onSnapToVertexChange?: (enabled: boolean) => void;
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
  onResetView,
  shadeType,
  onShadeTypeChange,
  snapToVertex = false,
  onSnapToVertexChange
}: BottomFloatingBarProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 z-30">
        <div className="flex items-center justify-between text-xs text-gray-300">
          {/* Left section - Status and coordinate information */}
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

            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            {/* Coordinates and zoom moved to left after units */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">X:</span>
                <span className="text-white font-medium">{cursorPosition.x.toFixed(2)}</span>
                <span className="text-gray-400 ml-2">Y:</span>
                <span className="text-white font-medium">{cursorPosition.y.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Zoom:</span>
                <span className="text-white font-medium">{zoomLevel}%</span>
              </div>
            </div>
          </div>
          
          {/* Right section - Snap to Vertex and Expandable controls */}
          <div className="flex items-center gap-2">
            {/* Snap to Vertex Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={snapToVertex ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSnapToVertexChange?.(!snapToVertex)}
                  className="h-6 px-2 text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-1"
                >
                  <Box className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Snap to Vertex (S) - {snapToVertex ? 'ON' : 'OFF'}</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="h-4 w-px bg-gray-600" />
            
            <ExpandableViewControls
              onZoomAll={onZoomAll}
              onZoomToSelected={onZoomToSelected}
              onResetView={onResetView}
              selectedObject={selectedObject}
            />
            
            <div className="h-4 w-px bg-gray-600" />
            
            <ExpandableShadeSelector
              currentShadeType={shadeType}
              onShadeTypeChange={onShadeTypeChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BottomFloatingBar;
