
import React, { useState } from 'react';
import { MapPin, Ruler, Move, SquareDashedMousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  activeTool: 'select' | 'point' | 'measure' | 'move';
}

const AidToolsBar = ({ onToolSelect, activeTool }: AidToolsBarProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 z-40 shadow-lg">
      <div className="flex gap-1">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('select')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'select' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Select Tool"
        >
          <SquareDashedMousePointer className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'point' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('point')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'point' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Point Tool - Click to add points"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'measure' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('measure')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'measure' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Measure Tool"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'move' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('move')}
          className={`h-8 w-8 p-0 transition-all ${
            activeTool === 'move' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          title="Move Tool"
        >
          <Move className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AidToolsBar;
