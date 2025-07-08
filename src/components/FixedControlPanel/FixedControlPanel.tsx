
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FixedControlPanelProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

interface PanelState {
  x: number;
  y: number;
  width: number;
  height: number;
}

const STORAGE_KEY = 'fixedControlPanel';
const DEFAULT_STATE: PanelState = {
  x: 56,
  y: 48,
  width: 288,
  height: 480
};

const MIN_WIDTH = 250;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 200;
const MAX_HEIGHT = 800;

const FixedControlPanel = ({
  title,
  children,
  isOpen,
  onClose,
  className
}: FixedControlPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [panelState, setPanelState] = useState<PanelState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'width' | 'height' | 'both' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever panel state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(panelState));
  }, [panelState]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panelState.x,
      y: e.clientY - panelState.y
    });
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - panelState.x,
        y: touch.clientY - panelState.y
      });
      e.preventDefault();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: 'width' | 'height' | 'both') => {
    e.stopPropagation();
    setIsResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: panelState.width,
      height: panelState.height
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - panelState.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - panelState.height, e.clientY - dragStart.y));
      setPanelState(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      setPanelState(prev => {
        let newWidth = prev.width;
        let newHeight = prev.height;

        if (isResizing === 'width' || isResizing === 'both') {
          newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.width + deltaX));
        }
        if (isResizing === 'height' || isResizing === 'both') {
          newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.height + deltaY));
        }

        return { ...prev, width: newWidth, height: newHeight };
      });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - panelState.width, touch.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - panelState.height, touch.clientY - dragStart.y));
      setPanelState(prev => ({ ...prev, x: newX, y: newY }));
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-40 transition-all duration-200",
        isDragging || isResizing ? "cursor-grabbing" : "",
        className
      )}
      style={{
        left: panelState.x,
        top: panelState.y,
        width: panelState.width,
        height: isCollapsed ? 'auto' : panelState.height
      }}
    >
      {/* Draggable Header */}
      <div 
        className={cn(
          "flex items-center justify-between px-3 py-2 border-b border-slate-700/30 cursor-grab select-none",
          "hover:bg-slate-800/50 transition-colors rounded-t-xl touch-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleHeaderClick}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-slate-200">{title || 'Panel'}</h3>
          <div className="text-slate-400">
            {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="h-5 w-5 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div 
          className="overflow-y-auto px-1 relative" 
          style={{ height: panelState.height - 44 }}
        >
          {children}

          {/* Resize handles */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-slate-600/20 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 'width')}
            title="Resize width"
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize hover:bg-slate-600/20 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 'height')}
            title="Resize height"
          />
          <div
            className="absolute right-0 bottom-0 w-4 h-4 cursor-nw-resize hover:bg-slate-600/30 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 'both')}
            title="Resize both"
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-slate-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedControlPanel;
