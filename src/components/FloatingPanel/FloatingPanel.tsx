
import React, { useState } from 'react';
import { X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  collapsible?: boolean;
  onClose?: () => void;
}

const FloatingPanel = ({
  title,
  children,
  defaultPosition = { x: 20, y: 20 },
  defaultSize = { width: 320, height: 400 },
  collapsible = true,
  onClose
}: FloatingPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      className="fixed bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-2xl z-50"
      style={{
        left: position.x,
        top: position.y,
        width: defaultSize.width,
        height: isCollapsed ? 'auto' : defaultSize.height,
        maxHeight: isCollapsed ? 'auto' : '80vh'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-slate-700/50 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <div className="flex items-center gap-1">
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <Minus className="h-3 w-3" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FloatingPanel;
