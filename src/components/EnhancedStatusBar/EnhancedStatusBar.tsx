
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, Layers } from 'lucide-react';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';


interface EnhancedStatusBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
  onGridToggle?: () => void;
  groundPlaneEnabled?: boolean;
  onGroundPlaneToggle?: () => void;
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
  onGridToggle = () => {},
  groundPlaneEnabled = false,
  onGroundPlaneToggle = () => {}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onGridToggle}
                    className={`h-6 w-6 p-0 hover:bg-accent ${gridEnabled ? 'bg-accent' : ''}`}
                  >
                    <Grid3X3 className={`h-3 w-3 ${gridEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Grid (G)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onGroundPlaneToggle}
                    className={`h-6 w-6 p-0 hover:bg-accent ${groundPlaneEnabled ? 'bg-accent' : ''}`}
                  >
                    <Layers className={`h-3 w-3 ${groundPlaneEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Ground Plane</p>
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
