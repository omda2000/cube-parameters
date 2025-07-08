
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MousePointer, MapPin, Ruler, Move } from 'lucide-react';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  activeTool: 'select' | 'point' | 'measure' | 'move';
}

const tools = [
  { id: 'select' as const, label: 'Select', icon: MousePointer },
  { id: 'point' as const, label: 'Point', icon: MapPin },
  { id: 'measure' as const, label: 'Measure', icon: Ruler },
  { id: 'move' as const, label: 'Move', icon: Move }
];

const AidToolsBar = ({ onToolSelect, activeTool }: AidToolsBarProps) => {
  return (
    <TooltipProvider>
      <div className="flex gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-2 shadow-2xl">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                  onClick={() => onToolSelect(tool.id)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-800 border-slate-700">
                <p className="text-slate-200">{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default AidToolsBar;
