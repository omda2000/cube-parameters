
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Grid3X3, Magnet, ChevronUp } from 'lucide-react';

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
              className="h-6 px-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 flex items-center gap-1"
              onClick={handleToggle}
            >
              <Magnet className={`h-3 w-3 ${snapToGrid ? 'text-green-600' : ''}`} />
              <ChevronUp className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Snap Controls (Click for options)</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating snap options - expands upward */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 bg-white/95 backdrop-blur-sm border border-gray-300/50 rounded-md p-2 z-50 shadow-lg">
            <div className="space-y-2 min-w-[120px]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Snap to Grid</span>
                <Button
                  variant={snapToGrid ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSnapToGridChange(!snapToGrid)}
                  className="h-6 w-6 p-0"
                >
                  <Grid3X3 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-gray-600">Grid Size</span>
                <div className="flex gap-1">
                  {[1, 5, 10].map((size) => (
                    <Button
                      key={size}
                      variant={gridSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => onGridSizeChange(size)}
                      className="h-6 px-2 text-xs"
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
