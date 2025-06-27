
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, ChevronUp, Eye } from 'lucide-react';

interface ExpandableViewControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedObject?: any;
}

const ExpandableViewControls = ({
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedObject
}: ExpandableViewControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Smart positioning to prevent overflow
  useEffect(() => {
    if (isExpanded && overlayRef.current && containerRef.current) {
      const overlay = overlayRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      
      // Check if there's enough space above
      const spaceAbove = rect.top;
      const overlayHeight = overlayRect.height;
      
      // If not enough space above, position differently
      if (spaceAbove < overlayHeight + 20) {
        overlay.style.bottom = 'auto';
        overlay.style.top = '100%';
        overlay.style.marginTop = '8px';
        overlay.style.marginBottom = '0';
      } else {
        overlay.style.top = 'auto';
        overlay.style.bottom = '100%';
        overlay.style.marginBottom = '8px';
        overlay.style.marginTop = '0';
      }
    }
  }, [isExpanded]);

  const viewControls = [
    { icon: Maximize, label: 'Zoom All (A)', action: onZoomAll, shortcut: 'A' },
    { icon: Focus, label: 'Focus Selected (F)', action: onZoomToSelected, shortcut: 'F', disabled: !selectedObject },
    { icon: ZoomIn, label: 'Zoom In', action: onZoomIn },
    { icon: ZoomOut, label: 'Zoom Out', action: onZoomOut },
    { icon: RotateCcw, label: 'Reset View (R)', action: onResetView, shortcut: 'R' },
  ];

  return (
    <TooltipProvider>
      <div ref={containerRef} className="relative">
        {/* Main view button - icon only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center justify-center"
              onClick={handleToggle}
            >
              <Eye className="h-4 w-4" />
              <ChevronUp className={`h-3 w-3 ml-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">View Controls</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating controls overlay with smart positioning */}
        {isExpanded && (
          <div 
            ref={overlayRef}
            className="absolute right-0 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-1.5 z-50 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <div className="grid grid-cols-2 gap-1 w-20">
              {viewControls.map((control, index) => {
                const IconComponent = control.icon;
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          control.action();
                          setIsExpanded(false);
                        }}
                        disabled={control.disabled}
                        className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <IconComponent className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-medium">{control.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ExpandableViewControls;
