
import React, { memo, useMemo, useRef, useCallback } from 'react';
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
  const lastUpdateRef = useRef<number>(0);

  // Memoize the selected object to prevent unnecessary re-renders
  const selectedObject = useMemo(() => {
    return selectedObjects.length > 0 ? selectedObjects[0] : null;
  }, [selectedObjects]);

  // Throttled cursor position formatting to prevent excessive updates
  const formattedPosition = useMemo(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 100) { // Throttle to 10fps for position updates
      return lastUpdateRef.current > 0 ? {
        x: cursorPosition.x.toFixed(2),
        y: cursorPosition.y.toFixed(2)
      } : { x: '0.00', y: '0.00' };
    }
    lastUpdateRef.current = now;
    
    return {
      x: cursorPosition.x.toFixed(2),
      y: cursorPosition.y.toFixed(2)
    };
  }, [cursorPosition.x, cursorPosition.y]);

  // Memoize static content to prevent re-renders
  const staticContent = useMemo(() => ({
    objectCount,
    gridStatus: gridEnabled ? `ON (${gridSpacing})` : 'OFF',
    units
  }), [objectCount, gridEnabled, gridSpacing, units]);

  // Memoized handlers to prevent prop drilling re-renders
  const zoomHandlers = useMemo(() => ({
    onZoomAll,
    onZoomToSelected,
    onZoomIn,
    onZoomOut,
    onResetView
  }), [onZoomAll, onZoomToSelected, onZoomIn, onZoomOut, onResetView]);

  const snapHandlers = useMemo(() => ({
    snapToGrid,
    onSnapToGridChange,
    gridSize,
    onGridSizeChange
  }), [snapToGrid, onSnapToGridChange, gridSize, onGridSizeChange]);

  return (
    <TooltipProvider>
      <div className={cn("fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 z-30 shadow-lg", className)}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left section - Status and coordinate information */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Objects:</span>
              <span className="text-foreground font-medium">{staticContent.objectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 flex-shrink-0" />
            
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Grid:</span>
              <span className="text-foreground font-medium">
                {staticContent.gridStatus}
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-4 flex-shrink-0" />
            
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Units:</span>
              <span className="text-foreground font-medium">{staticContent.units}</span>
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
              {...zoomHandlers}
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
              {...snapHandlers}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

BottomFloatingBar.displayName = 'BottomFloatingBar';

export default BottomFloatingBar;
