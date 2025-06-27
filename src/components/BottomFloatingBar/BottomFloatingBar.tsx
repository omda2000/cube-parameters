
import React from 'react';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridSpacing?: number;
  units?: string;
  cursorX?: number;
  cursorY?: number;
  zoomLevel?: number;
}

const BottomFloatingBar = ({
  objectCount = 0,
  gridSpacing = 1,
  units = 'units',
  cursorX = 0,
  cursorY = 0,
  zoomLevel = 100
}: BottomFloatingBarProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-md px-3 py-1.5 z-40 shadow-sm">
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-medium">Objects:</span>
          <span>{objectCount}</span>
        </div>
        
        <div className="w-px h-3 bg-gray-300" />
        
        <div className="flex items-center gap-1">
          <span className="font-medium">Grid:</span>
          <span>{gridSpacing} {units}</span>
        </div>
        
        <div className="w-px h-3 bg-gray-300" />
        
        <div className="flex items-center gap-1">
          <span className="font-medium">Units:</span>
          <span>{units}</span>
        </div>
        
        <div className="w-px h-3 bg-gray-300" />
        
        <div className="flex items-center gap-1">
          <span className="font-medium">X:</span>
          <span>{cursorX.toFixed(2)}</span>
          <span className="font-medium ml-2">Y:</span>
          <span>{cursorY.toFixed(2)}</span>
        </div>
        
        <div className="w-px h-3 bg-gray-300" />
        
        <div className="flex items-center gap-1">
          <span className="font-medium">Zoom:</span>
          <span>{zoomLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default BottomFloatingBar;
