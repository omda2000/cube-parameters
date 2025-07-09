
import { useState, useCallback } from 'react';

interface MouseInteractionState {
  objectData: any;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const useMouseInteractionState = () => {
  const [objectData, setObjectData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const updateObjectData = useCallback((data: any) => {
    setObjectData(data);
  }, []);

  const updateMousePosition = useCallback((position: { x: number; y: number }) => {
    setMousePosition(position);
  }, []);

  const updateHovering = useCallback((hovering: boolean) => {
    setIsHovering(hovering);
  }, []);

  return {
    objectData,
    mousePosition,
    isHovering,
    updateObjectData,
    updateMousePosition,
    updateHovering
  };
};
