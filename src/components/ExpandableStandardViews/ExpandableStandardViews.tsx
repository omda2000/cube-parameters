import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Grid3X3, ChevronDown, ChevronUp, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface ExpandableStandardViewsProps {
  onViewTop: () => void;
  onViewFront: () => void;
  onViewBack: () => void;
  onViewBottom: () => void;
  onViewRight: () => void;
  onViewLeft: () => void;
  onViewIsometric: () => void;
}

const ExpandableStandardViews = ({
  onViewTop,
  onViewFront,
  onViewBack,
  onViewBottom,
  onViewRight,
  onViewLeft,
  onViewIsometric
}: ExpandableStandardViewsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div ref={containerRef} className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="h-8 px-2 text-xs flex items-center gap-1"
          >
            <Grid3X3 className="h-3 w-3" />
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Standard Views</p>
        </TooltipContent>
      </Tooltip>

      {isExpanded && (
        <div className="absolute bottom-full mb-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg z-50">
          <div className="grid grid-cols-3 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewTop();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 flex items-center justify-center"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Top View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewFront();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 flex items-center justify-center"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Front View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewRight();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 flex items-center justify-center"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Right View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewBottom();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 flex items-center justify-center"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bottom View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewBack();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 flex items-center justify-center"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewLeft();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Left View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onViewIsometric();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 col-span-3 flex items-center justify-center"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Isometric View</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableStandardViews;