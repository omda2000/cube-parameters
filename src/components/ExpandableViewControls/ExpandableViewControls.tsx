
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Maximize, Focus, RotateCcw, ChevronUp, Eye } from 'lucide-react';

interface ExpandableViewControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onResetView: () => void;
  selectedObject?: any;
}

const ExpandableViewControls = ({
  onZoomAll,
  onZoomToSelected,
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
              className="h-6 px-2 text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-1"
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

        {/* Floating controls overlay - expands upward with bounds checking */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-1 z-50 shadow-lg animate-scale-in max-w-xs">
            <div className="flex flex-col gap-1 min-w-32">
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
                        className="h-8 px-3 justify-start text-xs text-slate-300 hover:text-white hover:bg-slate-600/50 disabled:opacity-30"
                      >
                        <IconComponent className="h-3.5 w-3.5 mr-2" />
                        <span>{control.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
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
