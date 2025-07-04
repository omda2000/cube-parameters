
import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
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

  const handleTitleClick = (e: React.MouseEvent) => {
    // Only toggle if clicking on title area, not buttons
    if (e.target === e.currentTarget && collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="fixed bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl z-50 transition-all duration-200"
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
        className="flex items-center justify-between p-3 border-b border-border cursor-move select-none hover:bg-muted/50 transition-colors"
        onMouseDown={handleMouseDown}
        onClick={handleTitleClick}
      >
        <h3 className="text-sm font-medium text-card-foreground flex items-center gap-2">
          {title}
          {collapsible && (
            <div className="text-muted-foreground">
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </div>
          )}
        </h3>
        <div className="flex items-center gap-1">
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto bg-card text-card-foreground" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FloatingPanel;
