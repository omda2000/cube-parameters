
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
}

const BottomFloatingBar = ({
  objectCount = 1,
  gridEnabled = true,
  gridSpacing = "1m",
  units = "m",
  cursorPosition = { x: 0, y: 0 },
  zoomLevel = 100
}: BottomFloatingBarProps) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-1.5 z-30">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Objects:</span>
            <span className="text-white font-medium">{objectCount}</span>
          </div>
          
          <Separator orientation="vertical" className="h-3 bg-slate-600" />
          
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Grid:</span>
            <span className="text-white font-medium">
              {gridEnabled ? `ON (${gridSpacing})` : 'OFF'}
            </span>
          </div>
          
          <Separator orientation="vertical" className="h-3 bg-slate-600" />
          
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Units:</span>
            <span className="text-white font-medium">{units}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">X:</span>
            <span className="text-white font-medium">{cursorPosition.x.toFixed(2)}</span>
            <span className="text-slate-400 ml-2">Y:</span>
            <span className="text-white font-medium">{cursorPosition.y.toFixed(2)}</span>
          </div>
          
          <Separator orientation="vertical" className="h-3 bg-slate-600" />
          
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Zoom:</span>
            <span className="text-white font-medium">{zoomLevel}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomFloatingBar;
