
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, ChevronUp } from 'lucide-react';

interface ExpandableZoomControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedObject?: any;
  zoomLevel?: number;
}

const ExpandableZoomControls = ({
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedObject,
  zoomLevel = 100
}: ExpandableZoomControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Enhanced touch and click handling
  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    // Clear any existing timeout
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    
    if (event.type === 'touchstart') {
      // For touch, add a small delay to prevent accidental triggers
      expandTimeoutRef.current = setTimeout(() => {
        setIsExpanded(!isExpanded);
      }, 50);
    } else {
      // Immediate response for mouse clicks
      setIsExpanded(!isExpanded);
    }
  };

  const handleZoomAction = (action: () => void, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Clear expand timeout if user is interacting with zoom buttons
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    
    action();
    
    // Auto-collapse after action on touch devices
    if (event.type === 'touchend' || event.type === 'touchstart') {
      setTimeout(() => {
        setIsExpanded(false);
      }, 500);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isExpanded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <div ref={containerRef} className="relative">
        {/* Main zoom toggle button with enhanced touch support */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-1 touch-manipulation"
              onMouseDown={handleInteractionStart}
              onTouchStart={handleInteractionStart}
              style={{ minHeight: '32px', minWidth: '60px' }} // Larger touch target
            >
              <ZoomIn className="h-3 w-3" />
              <span className="text-xs">{zoomLevel}%</span>
              <ChevronUp className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Controls (Tap for options)</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating zoom options - expands upward with touch support */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-2 z-50 shadow-lg">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => handleZoomAction(onZoomAll, e)}
                    onTouchStart={(e) => handleZoomAction(onZoomAll, e)}
                    className="h-10 w-10 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-600/60 touch-manipulation"
                  >
                    <Maximize className="h-5 w-5" />
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
                    onMouseDown={(e) => handleZoomAction(onZoomToSelected, e)}
                    onTouchStart={(e) => handleZoomAction(onZoomToSelected, e)}
                    disabled={!selectedObject}
                    className="h-10 w-10 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-600/60 disabled:opacity-30 touch-manipulation"
                  >
                    <Focus className="h-5 w-5" />
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
                    onMouseDown={(e) => handleZoomAction(onZoomIn, e)}
                    onTouchStart={(e) => handleZoomAction(onZoomIn, e)}
                    className="h-10 w-10 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-600/60 touch-manipulation"
                  >
                    <ZoomIn className="h-5 w-5" />
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
                    onMouseDown={(e) => handleZoomAction(onZoomOut, e)}
                    onTouchStart={(e) => handleZoomAction(onZoomOut, e)}
                    className="h-10 w-10 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-600/60 touch-manipulation"
                  >
                    <ZoomOut className="h-5 w-5" />
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
                    onMouseDown={(e) => handleZoomAction(onResetView, e)}
                    onTouchStart={(e) => handleZoomAction(onResetView, e)}
                    className="h-10 w-10 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-600/60 touch-manipulation"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset View (R)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ExpandableZoomControls;
