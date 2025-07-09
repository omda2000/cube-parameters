
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
  const lastValidCountRef = useRef<number>(1);
  const stabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Much more stable object count with better validation and longer stability period
  const stableObjectCount = useMemo(() => {
    // Validate and sanitize the input count
    const isValidCount = typeof objectCount === 'number' && 
                        !isNaN(objectCount) && 
                        isFinite(objectCount) &&
                        objectCount >= 0 && 
                        objectCount < 10000;
    
    const validCount = isValidCount ? Math.floor(objectCount) : lastValidCountRef.current;
    
    // Update last valid count if we have a valid input
    if (isValidCount) {
      lastValidCountRef.current = validCount;
    }
    
    // Clear any existing timeout
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
    }
    
    // Only update stable count after a much longer delay to prevent flickering
    stabilityTimeoutRef.current = setTimeout(() => {
      if (Math.abs(validCount - stableCountRef.current) > 0) {
        console.log('BottomFloatingBar: Updating stable count from', stableCountRef.current, 'to', validCount);
        stableCountRef.current = validCount;
      }
    }, 3000); // 3 second stability period to prevent rapid changes
    
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

  // Stabilized coordinate display with proper validation and rounding
  const coordinateDisplay = useMemo(() => {
    if (!cursorPosition || typeof cursorPosition !== 'object') {
      return { x: 0, y: 0 };
    }
    
    const x = typeof cursorPosition.x === 'number' && isFinite(cursorPosition.x) ? cursorPosition.x : 0;
    const y = typeof cursorPosition.y === 'number' && isFinite(cursorPosition.y) ? cursorPosition.y : 0;
    
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10
    };
  }, [cursorPosition?.x, cursorPosition?.y]);

  // Stable grid status
  const gridStatus = useMemo(() => {
    return gridEnabled ? `ON (${gridSpacing || '1m'})` : 'OFF';
  }, [gridEnabled, gridSpacing]);

  // Stable zoom level with proper validation
  const stableZoomLevel = useMemo(() => {
    const zoom = typeof zoomLevel === 'number' && isFinite(zoomLevel) ? zoomLevel : 100;
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
