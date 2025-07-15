
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3 } from 'lucide-react';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';
import ExpandableZoomControls from '../ExpandableZoomControls/ExpandableZoomControls';

interface EnhancedStatusBarProps {
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
  onGridToggle?: () => void;
}

const EnhancedStatusBar = ({
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
  onGridToggle = () => {}
}: EnhancedStatusBarProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 z-30 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          {/* Left section - Object and scene information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Objects:</span>
              <Badge variant="secondary" className="text-xs font-medium">
                {objectCount}
              </Badge>
              {selectedObject && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">Selected:</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedObject.name || 'Object'}
                  </Badge>
                </>
              )}
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Grid:</span>
              <Badge variant={gridEnabled ? "default" : "secondary"} className="text-xs">
                {gridEnabled ? `ON (${gridSpacing})` : 'OFF'}
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onGridToggle}
                    className="h-6 w-6 p-0 hover:bg-accent"
                  >
                    <Grid3X3 className={`h-3 w-3 ${gridEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Grid (G)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Units:</span>
              <Badge variant="outline" className="text-xs font-medium">
                {units}
              </Badge>
            </div>
          </div>
          
          {/* Center section - Coordinates and zoom controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>X:</span>
                <span className="text-foreground font-mono text-xs min-w-[3rem] text-right">
                  {cursorPosition.x.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>Y:</span>
                <span className="text-foreground font-mono text-xs min-w-[3rem] text-right">
                  {cursorPosition.y.toFixed(2)}
                </span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-4" />
            
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
          
          {/* Right section - Quick actions and settings */}
          <div className="flex items-center gap-3">
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

export default EnhancedStatusBar;
