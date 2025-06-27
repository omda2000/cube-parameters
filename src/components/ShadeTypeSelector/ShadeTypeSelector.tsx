
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
  const [isOpen, setIsOpen] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const currentShade = shadeTypes.find(shade => shade.type === currentShadeType) || shadeTypes[0];

  const startLongPress = () => {
    setIsLongPressing(true);
    longPressTimer.current = setTimeout(() => {
      setIsOpen(true);
      setIsLongPressing(false);
    }, 500); // 500ms long press
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPressing(false);
  };

  const handleShadeTypeSelect = (type: ShadeType) => {
    onShadeTypeChange(type);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
                onMouseDown={startLongPress}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={endLongPress}
              >
                {currentShade.icon}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Shade Type: {currentShade.label} (Long press for options)</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-48 p-2 bg-slate-800 border-slate-700" side="top">
          <div className="space-y-1">
            {shadeTypes.map((shade) => (
              <Button
                key={shade.type}
                variant={currentShadeType === shade.type ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleShadeTypeSelect(shade.type)}
              >
                {shade.icon}
                <span className="ml-2">{shade.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default ShadeTypeSelector;
