
import React, { useState } from 'react';
import { MapPin, Ruler, Target, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  activeTool: 'select' | 'point' | 'measure' | 'move';
}

const AidToolsBar = ({ onToolSelect, activeTool }: AidToolsBarProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 z-40">
      <div className="flex gap-1">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('select')}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white"
          title="Select Tool"
        >
          <Target className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'point' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('point')}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white"
          title="Point Tool - Click to add points"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'measure' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('measure')}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white"
          title="Measure Tool"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'move' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('move')}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white"
          title="Move Tool"
        >
          <Move className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AidToolsBar;
