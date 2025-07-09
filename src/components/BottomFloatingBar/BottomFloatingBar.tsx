
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
  objectCount = 0,
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
  const lastPositionUpdateRef = useRef<number>(0);
  const stablePositionRef = useRef({ x: '0.00', y: '0.00' });

  // Stable object count - prevent flickering by using a more reliable count
  const stableObjectCount = useMemo(() => {
    // Ensure we have a stable, non-zero count
    const count = Math.max(objectCount, selectedObjects.length > 0 ? selectedObjects.length : 1);
    return count;
  }, [objectCount, selectedObjects.length]);

  // Memoize the selected object to prevent unnecessary re-renders
  const selectedObject = useMemo(() => {
    return selectedObjects.length > 0 ? selectedObjects[0] : null;
  }, [selectedObjects]);

  // Heavily throttled cursor position to prevent excessive updates
  const formattedPosition = useMemo(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastPositionUpdateRef.current;
    
    // Only update position every 200ms to prevent flickering
    if (timeSinceLastUpdate > 200) {
      lastPositionUpdateRef.current = now;
      stablePositionRef.current = {
        x: cursorPosition.x.toFixed(2),
        y: cursorPosition.y.toFixed(2)
      };
    }
    
    return stablePositionRef.current;
  }, [cursorPosition.x, cursorPosition.y]);

  // Memoize static content with stable references
  const staticContent = useMemo(() => ({
    objectCount: stableObjectCount,
    gridStatus: gridEnabled ? `ON (${gridSpacing})` : 'OFF',
    units,
    zoomLevel: Math.round(zoomLevel)
  }), [stableObjectCount, gridEnabled, gridSpacing, units, zoomLevel]);

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
            
            <Separator orientation="vertical" className="h-4 flex-shrink-0" />
            
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Zoom:</span>
              <span className="text-foreground font-medium">{staticContent.zoomLevel}%</span>
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
