
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEnhancedDragging } from '../../hooks/useEnhancedDragging';

interface FixedControlPanelProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

const STORAGE_KEY = 'fixedControlPanel';
const DEFAULT_STATE = {
  x: 56,
  y: 48,
  width: 288,
  height: 480
};

const FixedControlPanel = ({
  title,
  children,
  isOpen,
  onClose,
  className
}: FixedControlPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load initial state from localStorage
  const [initialState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const {
    dragState,
    isDragging,
    isResizing,
    handleMouseDown,
    handleTouchStart,
    handleResizeStart
  } = useEnhancedDragging({
    initialState,
    constraints: {
      minWidth: 250,
      maxWidth: 500,
      minHeight: 200,
      maxHeight: 800
    },
    onStateChange: (state) => {
      // Save to localStorage when state changes
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    throttleMs: 16
  });

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-40 transition-all duration-200",
        isDragging || isResizing ? "cursor-grabbing" : "",
        className
      )}
      style={{
        left: dragState.x,
        top: dragState.y,
        width: dragState.width,
        height: isCollapsed ? 'auto' : dragState.height,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }}
    >
      {/* Draggable Header */}
      <div 
        className={cn(
          "flex items-center justify-between px-3 py-2 border-b border-slate-700/30 cursor-grab select-none",
          "hover:bg-slate-800/50 transition-colors rounded-t-xl touch-none",
          isDragging ? "cursor-grabbing bg-slate-800/70" : "cursor-grab"
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
          style={{ height: dragState.height - 44 }}
        >
          {children}

          {/* Resize handles */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-slate-600/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'width')}
            title="Resize width"
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize hover:bg-slate-600/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'height')}
            title="Resize height"
          />
          <div
            className="absolute right-0 bottom-0 w-4 h-4 cursor-nw-resize hover:bg-slate-600/30 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'both')}
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
