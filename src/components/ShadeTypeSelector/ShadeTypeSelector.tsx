
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const currentShade = shadeTypes.find(shade => shade.type === currentShadeType) || shadeTypes[0];

  const startLongPress = () => {
    setIsLongPressing(true);
    longPressTimer.current = setTimeout(() => {
      setIsExpanded(true);
      setIsLongPressing(false);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPressing(false);
  };

  const handleShadeTypeSelect = (type: ShadeType) => {
    onShadeTypeChange(type);
    setIsExpanded(false);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = () => setIsExpanded(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

  if (isExpanded) {
    return (
      <TooltipProvider>
        <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1" onClick={(e) => e.stopPropagation()}>
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
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onMouseLeave={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
          >
            {currentShade.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shade: {currentShade.label} (Long press for options)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShadeTypeSelector;
