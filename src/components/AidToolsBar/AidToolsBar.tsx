
import React, { useState } from 'react';
import { MapPin, Ruler, Target, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  activeTool: 'select' | 'point' | 'measure' | 'move';
}

const AidToolsBar = ({ onToolSelect, activeTool }: AidToolsBarProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-1 z-40 shadow-sm">
      <div className="flex gap-0">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('select')}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900"
          title="Select Tool"
        >
          <Target className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant={activeTool === 'point' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('point')}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900"
          title="Point Tool - Click to add points"
        >
          <MapPin className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant={activeTool === 'measure' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('measure')}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900"
          title="Measure Tool"
        >
          <Ruler className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant={activeTool === 'move' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onToolSelect('move')}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900"
          title="Move Tool"
        >
          <Move className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default AidToolsBar;
