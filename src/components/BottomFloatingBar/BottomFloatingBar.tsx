
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
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

const BottomFloatingBar = React.memo(({
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
  const { selectedObject } = useSelectionContext();
  const stableCountRef = useRef<number>(1);
  const stabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // More stable object count with proper validation
  const stableObjectCount = useMemo(() => {
    // Validate and sanitize the input count
    const validCount = typeof objectCount === 'number' && 
                      !isNaN(objectCount) && 
                      objectCount >= 0 && 
                      objectCount < 10000 ? objectCount : 1;
    
    // Clear any existing timeout
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
    }
    
    // Only update stable count after a longer delay to prevent flickering
    stabilityTimeoutRef.current = setTimeout(() => {
      stableCountRef.current = validCount;
    }, 2000); // 2 second stability period
    
    // Return the current stable count instead of the new count
    return stableCountRef.current;
  }, [objectCount]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (stabilityTimeoutRef.current) {
        clearTimeout(stabilityTimeoutRef.current);
      }
    };
  }, []);

  // Stabilized coordinate display with proper rounding
  const coordinateDisplay = useMemo(() => {
    if (!cursorPosition) return { x: 0, y: 0 };
    
    const x = typeof cursorPosition.x === 'number' ? cursorPosition.x : 0;
    const y = typeof cursorPosition.y === 'number' ? cursorPosition.y : 0;
    
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10
    };
  }, [cursorPosition?.x, cursorPosition?.y]);

  // Stable grid status
  const gridStatus = useMemo(() => {
    return gridEnabled ? `ON (${gridSpacing})` : 'OFF';
  }, [gridEnabled, gridSpacing]);

  // Stable zoom level
  const stableZoomLevel = useMemo(() => {
    const zoom = typeof zoomLevel === 'number' ? zoomLevel : 100;
    return Math.max(1, Math.min(500, Math.round(zoom))); // Bounded and rounded
  }, [zoomLevel]);

  return (
    <TooltipProvider>
      <div className={cn("fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 z-30 shadow-lg", className)}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left section - Status and coordinate information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Objects:</span>
              <span className="text-foreground font-medium">{stableObjectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <span>Grid:</span>
              <span className="text-foreground font-medium">{gridStatus}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <span>Units:</span>
              <span className="text-foreground font-medium">{units}</span>
            </div>

            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>X:</span>
                <span className="text-foreground font-medium">{coordinateDisplay.x.toFixed(1)}</span>
                <span className="ml-2">Y:</span>
                <span className="text-foreground font-medium">{coordinateDisplay.y.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Center section - Zoom controls */}
          <div className="flex items-center">
            <ExpandableZoomControls
              onZoomAll={onZoomAll}
              onZoomToSelected={onZoomToSelected}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onResetView={onResetView}
              selectedObject={selectedObject}
              zoomLevel={stableZoomLevel}
            />
          </div>
          
          {/* Right section - Shade selector and snap controls */}
          <div className="flex items-center gap-2">
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
