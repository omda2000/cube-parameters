
import React, { memo, useMemo } from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';
import ExpandableZoomControls from '../ExpandableZoomControls/ExpandableZoomControls';
import ExpandableSnapControls from '../ExpandableSnapControls/ExpandableSnapControls';
import { cn } from '@/lib/utils';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
  onZoomAll?: () => void;
  onZoomToSelected?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  snapToGrid?: boolean;
  onSnapToGridChange?: (enabled: boolean) => void;
  gridSize?: number;
  onGridSizeChange?: (size: number) => void;
  className?: string;
}

const BottomFloatingBar = memo(({
  objectCount = 1,
  gridEnabled = true,
  gridSpacing = "1m",
  units = "m",
  cursorPosition = { x: 0, y: 0 },
  zoomLevel = 100,
  shadeType,
  onShadeTypeChange,
  onZoomAll = () => {},
  onZoomToSelected = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onResetView = () => {},
  snapToGrid = false,
  onSnapToGridChange = () => {},
  gridSize = 1,
  onGridSizeChange = () => {},
  className
}: BottomFloatingBarProps) => {
  const { selectedObjects } = useSelectionContext();

  // Memoize the selected object to prevent unnecessary re-renders
  const selectedObject = useMemo(() => {
    return selectedObjects.length > 0 ? selectedObjects[0] : null;
  }, [selectedObjects]);

  // Memoize cursor position display to prevent frequent updates
  const formattedPosition = useMemo(() => ({
    x: cursorPosition.x.toFixed(2),
    y: cursorPosition.y.toFixed(2)
  }), [cursorPosition.x, cursorPosition.y]);

  return (
    <TooltipProvider>
      <div className={cn("fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 z-30 shadow-lg", className)}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left section - Status and coordinate information */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Objects:</span>
              <span className="text-foreground font-medium">{objectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 flex-shrink-0" />
            
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Grid:</span>
              <span className="text-foreground font-medium">
                {gridEnabled ? `ON (${gridSpacing})` : 'OFF'}
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-4 flex-shrink-0" />
            
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Units:</span>
              <span className="text-foreground font-medium">{units}</span>
            </div>

            <Separator orientation="vertical" className="h-4 flex-shrink-0" />
            
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span>X:</span>
                <span className="text-foreground font-medium font-mono">{formattedPosition.x}</span>
                <span className="ml-2">Y:</span>
                <span className="text-foreground font-medium font-mono">{formattedPosition.y}</span>
              </div>
            </div>
          </div>
          
          {/* Center section - Zoom controls */}
          <div className="flex items-center flex-shrink-0">
            <ExpandableZoomControls
              onZoomAll={onZoomAll}
              onZoomToSelected={onZoomToSelected}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onResetView={onResetView}
              selectedObject={selectedObject}
              zoomLevel={zoomLevel}
            />
          </div>
          
          {/* Right section - Shade selector and snap controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ExpandableShadeSelector
              currentShadeType={shadeType}
              onShadeTypeChange={onShadeTypeChange}
            />
            
            <Separator orientation="vertical" className="h-4" />
            
            <ExpandableSnapControls
              snapToGrid={snapToGrid}
              onSnapToGridChange={onSnapToGridChange}
              gridSize={gridSize}
              onGridSizeChange={onGridSizeChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

BottomFloatingBar.displayName = 'BottomFloatingBar';

export default BottomFloatingBar;
