
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Box, Grid3X3, EyeOff, Layers, ChevronUp } from 'lucide-react';

export type ShadeType = 'shaded' | 'wireframe' | 'hidden' | 'shaded-with-edges';

interface ExpandableShadeServerProps {
  currentShadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
}

const shadeTypes: Array<{ type: ShadeType; label: string; icon: React.ReactNode }> = [
  { type: 'shaded', label: 'Shaded', icon: <Box className="h-3 w-3" /> },
  { type: 'wireframe', label: 'Wireframe', icon: <Grid3X3 className="h-3 w-3" /> },
  { type: 'hidden', label: 'Hidden', icon: <EyeOff className="h-3 w-3" /> },
  { type: 'shaded-with-edges', label: 'Shaded with Edges', icon: <Layers className="h-3 w-3" /> },
];

const ExpandableShadeSelector = ({ currentShadeType, onShadeTypeChange }: ExpandableShadeServerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentShade = shadeTypes.find(shade => shade.type === currentShadeType) || shadeTypes[0];

  const handleShadeTypeSelect = (type: ShadeType) => {
    onShadeTypeChange(type);
    setIsExpanded(false);
  };

  const handleMainButtonClick = () => {
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
        {/* Main shade button - icon only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-1"
              onClick={handleMainButtonClick}
            >
              {currentShade.icon}
              <ChevronUp className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentShade.label} (Click for options)</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating options overlay - expands upward */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-1 z-50 shadow-lg">
            <div className="flex flex-col gap-1">
              {shadeTypes.map((shade) => (
                <Tooltip key={shade.type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentShadeType === shade.type ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleShadeTypeSelect(shade.type)}
                    >
                      {shade.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{shade.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ExpandableShadeSelector;
