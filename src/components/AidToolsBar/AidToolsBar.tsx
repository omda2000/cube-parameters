
import React from 'react';
import { MapPin, Ruler, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure') => void;
  activeTool: 'select' | 'point' | 'measure';
  onViewFront?: () => void;
  onViewBack?: () => void;
  onToggle3DRotate?: () => void;
}

const AidToolsBar = ({ onToolSelect, activeTool, onViewFront, onViewBack, onToggle3DRotate }: AidToolsBarProps) => {
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
          <Target className="h-4 w-4" />
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
        
        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* 3D View Controls */}
        {onViewFront && (
          <button
            onClick={onViewFront}
            className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded transition-colors"
            title="Front View"
          >
            <span className="material-icons view-front" style={{ fontSize: '20px' }}>visibility</span>
          </button>
        )}
        
        {onViewBack && (
          <button
            onClick={onViewBack}
            className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded transition-colors"
            title="Back View"
          >
            <span className="material-icons view-back" style={{ fontSize: '20px' }}>visibility_off</span>
          </button>
        )}
        
        {onToggle3DRotate && (
          <button
            onClick={onToggle3DRotate}
            className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded transition-colors"
            title="3D Rotate"
          >
            <span className="material-icons view-rotate" style={{ fontSize: '20px' }}>3d_rotation</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AidToolsBar;
