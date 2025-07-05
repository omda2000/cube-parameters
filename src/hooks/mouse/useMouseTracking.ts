
import { useState, useRef, useCallback } from 'react';

export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Throttle mouse move to improve performance
  const throttledMouseMove = useCallback((callback: (event: MouseEvent) => void) => {
    let isThrottled = false;
    return (event: MouseEvent) => {
      if (!isThrottled) {
        callback(event);
        isThrottled = true;
        requestAnimationFrame(() => {
          isThrottled = false;
        });
      }
    };
  }, []);

  const updateMousePosition = useCallback((x: number, y: number) => {
    const pos = { x, y };
    setMousePosition(pos);
    mousePositionRef.current = pos;
  }, []);

  return {
    mousePosition,
    mousePositionRef,
    throttledMouseMove,
    updateMousePosition
  };
};
