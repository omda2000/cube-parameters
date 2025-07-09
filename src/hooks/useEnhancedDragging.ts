
import { useState, useCallback, useRef, useEffect } from 'react';

interface DragState {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  snapToGrid?: boolean;
  gridSize?: number;
}

interface UseDraggingOptions {
  initialState: DragState;
  constraints?: DragConstraints;
  onStateChange?: (state: DragState) => void;
  throttleMs?: number;
}

export const useEnhancedDragging = ({
  initialState,
  constraints = {},
  onStateChange,
  throttleMs = 16 // ~60fps
}: UseDraggingOptions) => {
  const [dragState, setDragState] = useState<DragState>(initialState);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'width' | 'height' | 'both' | null>(null);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const animationFrameRef = useRef<number>();
  const throttleTimeoutRef = useRef<NodeJS.Timeout>();

  const constrainPosition = useCallback((x: number, y: number, width: number, height: number) => {
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    
    let constrainedX = Math.max(0, Math.min(maxX, x));
    let constrainedY = Math.max(0, Math.min(maxY, y));

    if (constraints.snapToGrid && constraints.gridSize) {
      constrainedX = Math.round(constrainedX / constraints.gridSize) * constraints.gridSize;
      constrainedY = Math.round(constrainedY / constraints.gridSize) * constraints.gridSize;
    }

    return { x: constrainedX, y: constrainedY };
  }, [constraints.snapToGrid, constraints.gridSize]);

  const constrainSize = useCallback((width: number, height: number) => {
    const {
      minWidth = 200,
      maxWidth = window.innerWidth * 0.8,
      minHeight = 150,
      maxHeight = window.innerHeight * 0.8
    } = constraints;

    return {
      width: Math.max(minWidth, Math.min(maxWidth, width)),
      height: Math.max(minHeight, Math.min(maxHeight, height))
    };
  }, [constraints]);

  const updateStateThrottled = useCallback((newState: DragState) => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
    }

    throttleTimeoutRef.current = setTimeout(() => {
      setDragState(newState);
      onStateChange?.(newState);
    }, throttleMs);
  }, [onStateChange, throttleMs]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - dragState.x,
      y: e.clientY - dragState.y
    };
    e.preventDefault();
  }, [dragState.x, dragState.y]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX - dragState.x,
        y: touch.clientY - dragState.y
      };
      e.preventDefault();
    }
  }, [dragState.x, dragState.y]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: 'width' | 'height' | 'both') => {
    e.stopPropagation();
    setIsResizing(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dragState.width,
      height: dragState.height
    };
    e.preventDefault();
  }, [dragState.width, dragState.height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (isDragging) {
        const { x, y } = constrainPosition(
          e.clientX - dragStartRef.current.x,
          e.clientY - dragStartRef.current.y,
          dragState.width,
          dragState.height
        );

        const newState = { ...dragState, x, y };
        updateStateThrottled(newState);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;

        let newWidth = dragState.width;
        let newHeight = dragState.height;

        if (isResizing === 'width' || isResizing === 'both') {
          newWidth = resizeStartRef.current.width + deltaX;
        }
        if (isResizing === 'height' || isResizing === 'both') {
          newHeight = resizeStartRef.current.height + deltaY;
        }

        const constrainedSize = constrainSize(newWidth, newHeight);
        const newState = { ...dragState, ...constrainedSize };
        updateStateThrottled(newState);
      }
    });
  }, [isDragging, isResizing, dragState, constrainPosition, constrainSize, updateStateThrottled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const { x, y } = constrainPosition(
          touch.clientX - dragStartRef.current.x,
          touch.clientY - dragStartRef.current.y,
          dragState.width,
          dragState.height
        );

        const newState = { ...dragState, x, y };
        updateStateThrottled(newState);
      });
    }
  }, [isDragging, dragState, constrainPosition, updateStateThrottled]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
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
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, []);

  return {
    dragState,
    isDragging,
    isResizing,
    handleMouseDown,
    handleTouchStart,
    handleResizeStart,
    setDragState
  };
};
