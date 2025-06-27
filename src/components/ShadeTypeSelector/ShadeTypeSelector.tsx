
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Box, Grid3X3, EyeOff, Layers } from 'lucide-react';

export type ShadeType = 'shaded' | 'wireframe' | 'hidden' | 'shaded-with-edges';

interface ShadeTypeSelectorProps {
  currentShadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
}

const shadeTypes: Array<{ type: ShadeType; label: string; icon: React.ReactNode }> = [
  { type: 'shaded', label: 'Shaded', icon: <Box className="h-4 w-4" /> },
  { type: 'wireframe', label: 'Wireframe', icon: <Grid3X3 className="h-4 w-4" /> },
  { type: 'hidden', label: 'Hidden', icon: <EyeOff className="h-4 w-4" /> },
  { type: 'shaded-with-edges', label: 'Shaded with Edges', icon: <Layers className="h-4 w-4" /> },
];

const ShadeTypeSelector = ({ currentShadeType, onShadeTypeChange }: ShadeTypeSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentShade = shadeTypes.find(shade => shade.type === currentShadeType) || shadeTypes[0];

  const handleShadeTypeSelect = (type: ShadeType) => {
    onShadeTypeChange(type);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.shade-selector-container')) {
          setIsExpanded(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <TooltipProvider>
      <div className="shade-selector-container relative">
        {/* Floating expanded options */}
        {isExpanded && (
          <div className="absolute left-12 top-0 flex gap-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-1 z-50">
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
        )}

        {/* Main shade button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={toggleExpanded}
            >
              {currentShade.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Shade: {currentShade.label}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ShadeTypeSelector;
