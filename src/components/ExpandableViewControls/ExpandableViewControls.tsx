
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, ChevronUp, Eye } from 'lucide-react';

import type { SceneObject } from '@/types/model';

interface ExpandableViewControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedObject?: SceneObject | null;
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
        {/* Main view button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-1"
              onClick={handleToggle}
            >
              <Eye className="h-3 w-3" />
              <ChevronUp className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Controls</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating controls overlay - expands upward */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-1 z-50 shadow-lg animate-scale-in">
            <div className="grid grid-cols-2 gap-1 min-w-32">
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
                        className="h-8 w-8 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-600/50 disabled:opacity-30"
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{control.label}</p>
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
