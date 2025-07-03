
import { useState, useRef, useCallback } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const updateMousePosition = useCallback((event: MouseEvent) => {
    const pos = { x: event.clientX, y: event.clientY };
    setMousePosition(pos);
    mousePositionRef.current = pos;
  }, []);

  return {
    mousePosition,
    mousePositionRef,
    updateMousePosition
  };
};
