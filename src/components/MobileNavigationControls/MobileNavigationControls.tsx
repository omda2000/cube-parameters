
import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResponsiveMode } from '../../hooks/useResponsiveMode';

interface MobileNavigationControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onResetView: () => void;
  onRecenter?: () => void;
  hasSelection?: boolean;
}

const MobileNavigationControls = ({
  onZoomIn,
  onZoomOut,
  onZoomAll,
  onZoomToSelected,
  onResetView,
  onRecenter,
  hasSelection = false
}: MobileNavigationControlsProps) => {
  const { isMobile } = useResponsiveMode();

  if (!isMobile) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all touch-manipulation"
          title="Zoom In"
        >
          <ZoomIn className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all touch-manipulation"
          title="Zoom Out"
        >
          <ZoomOut className="h-6 w-6" />
        </Button>
        
        <div className="h-px bg-border my-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomAll}
          className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all touch-manipulation"
          title="Fit All"
        >
          <Maximize className="h-6 w-6" />
        </Button>
        
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomToSelected}
            className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all touch-manipulation"
            title="Focus Selected"
          >
            <Focus className="h-6 w-6" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all touch-manipulation"
          title="Reset View"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        
        {onRecenter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRecenter}
            className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all touch-manipulation"
            title="Recenter"
          >
            <Move className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileNavigationControls;
