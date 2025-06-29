
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Magnet, ChevronUp } from 'lucide-react';

interface ExpandableSnapControlsProps {
  snapToGrid: boolean;
  onSnapToGridChange: (enabled: boolean) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
}

const ExpandableSnapControls = ({
  snapToGrid,
  onSnapToGridChange,
  gridSize,
  onGridSizeChange
}: ExpandableSnapControlsProps) => {
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

  return (
    <TooltipProvider>
      <div ref={containerRef} className="relative">
        {/* Main snap toggle button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-1"
              onClick={handleToggle}
            >
              <Magnet className={`h-3 w-3 ${snapToGrid ? 'text-green-400' : ''}`} />
              <ChevronUp className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Snap Controls (Click for options)</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating snap options - redesigned layout */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 w-36 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-2 z-50 shadow-lg">
            <div className="space-y-2">
              <Button
                variant={snapToGrid ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSnapToGridChange(!snapToGrid)}
                className="w-full flex items-center gap-1 h-6"
              >
                <Magnet className="h-3 w-3" />
                <span className="text-xs">{snapToGrid ? 'Snap On' : 'Snap Off'}</span>
              </Button>

              <div className="space-y-1">
                <span className="text-xs text-slate-300">Grid Size</span>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 5, 10].map((size) => (
                    <Button
                      key={size}
                      variant={gridSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onGridSizeChange(size)}
                      className="h-6 p-0 text-xs"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ExpandableSnapControls;
