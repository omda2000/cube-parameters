
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

const FixedControlPanel = ({
  title,
  children,
  isOpen,
  onClose,
  className
}: FixedControlPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 56, y: 48 }); // left-14 = 56px, top-12 = 48px
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 288, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 288, touch.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, touch.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Only toggle collapse if clicking on the header itself, not on buttons
    if (e.target === e.currentTarget) {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, dragStart]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-40 transition-all duration-200",
        "w-72 max-h-[82vh]",
        isDragging ? "cursor-grabbing" : "",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        height: isCollapsed ? 'auto' : '480px'
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
        <div className="overflow-y-auto px-1" style={{ height: '432px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FixedControlPanel;
