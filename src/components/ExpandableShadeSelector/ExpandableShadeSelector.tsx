
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
  { type: 'shaded', label: 'Shaded', icon: <Box className="h-3.5 w-3.5" /> },
  { type: 'wireframe', label: 'Wireframe', icon: <Grid3X3 className="h-3.5 w-3.5" /> },
  { type: 'hidden', label: 'Hidden', icon: <EyeOff className="h-3.5 w-3.5" /> },
  { type: 'shaded-with-edges', label: 'Shaded with Edges', icon: <Layers className="h-3.5 w-3.5" /> },
];

const ExpandableShadeSelector = ({ currentShadeType, onShadeTypeChange }: ExpandableShadeServerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
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

  return (
    <TooltipProvider>
      <div ref={containerRef} className="relative">
        {/* Main shade button - icon only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center justify-center"
              onClick={handleMainButtonClick}
            >
              {currentShade.icon}
              <ChevronUp className={`h-3 w-3 ml-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{currentShade.label} - Click for options</p>
          </TooltipContent>
        </Tooltip>

        {/* Floating options overlay with smart positioning */}
        {isExpanded && (
          <div 
            ref={overlayRef}
            className="absolute left-0 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-md p-1.5 z-50 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <div className="flex flex-col gap-1 min-w-36">
              {shadeTypes.map((shade) => (
                <Tooltip key={shade.type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentShadeType === shade.type ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3 justify-start text-sm font-medium"
                      onClick={() => handleShadeTypeSelect(shade.type)}
                    >
                      {shade.icon}
                      <span className="ml-2.5">{shade.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="font-medium">{shade.label}</p>
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
