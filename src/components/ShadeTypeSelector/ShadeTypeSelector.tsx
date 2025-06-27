
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Box, Grid3X3, EyeOff, Layers } from 'lucide-react';

export type ShadeType = 'shaded' | 'wireframe' | 'hidden' | 'shaded-with-edges';

interface ShadeTypeSelectorProps {
  currentShadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
}

const shadeTypes: Array<{ type: ShadeType; label: string; icon: React.ReactNode }> = [
  { type: 'shaded', label: 'Shaded', icon: <Box className="h-3 w-3" /> },
  { type: 'wireframe', label: 'Wireframe', icon: <Grid3X3 className="h-3 w-3" /> },
  { type: 'hidden', label: 'Hidden', icon: <EyeOff className="h-3 w-3" /> },
  { type: 'shaded-with-edges', label: 'Shaded with Edges', icon: <Layers className="h-3 w-3" /> },
];

const ShadeTypeSelector = ({ currentShadeType, onShadeTypeChange }: ShadeTypeSelectorProps) => {
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
        {/* Main shade button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={handleMainButtonClick}
            >
              {currentShade.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentShade.label} (Click for options)</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating options overlay */}
        {isExpanded && (
          <div className="absolute left-8 top-0 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-0.5 z-50 shadow-lg">
            <div className="flex gap-0.5">
              {shadeTypes.map((shade) => (
                <Tooltip key={shade.type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentShadeType === shade.type ? "default" : "ghost"}
                      size="sm"
                      className="h-6 w-6 p-0"
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

export default ShadeTypeSelector;
