
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useResponsiveMode } from '../../hooks/useResponsiveMode';

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd?: () => void;
  size?: number;
  maxDistance?: number;
  className?: string;
}

const VirtualJoystick = ({
  onMove,
  onEnd,
  size = 100,
  maxDistance = 40,
  className = ''
}: VirtualJoystickProps) => {
  const { isMobile } = useResponsiveMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    setIsActive(true);
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance <= maxDistance) {
      setKnobPosition({ x: deltaX, y: deltaY });
      onMove(deltaX / maxDistance, deltaY / maxDistance);
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      const limitedX = Math.cos(angle) * maxDistance;
      const limitedY = Math.sin(angle) * maxDistance;
      setKnobPosition({ x: limitedX, y: limitedY });
      onMove(limitedX / maxDistance, limitedY / maxDistance);
    }
  }, [maxDistance, onMove]);

  const handleEnd = useCallback(() => {
    setIsActive(false);
    setKnobPosition({ x: 0, y: 0 });
    onMove(0, 0);
    if (onEnd) onEnd();
  }, [onMove, onEnd]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isActive) return;
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [isActive, handleStart]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    handleStart(e.clientX, e.clientY);
  }, [isActive, handleStart]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('touchcancel', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
        document.removeEventListener('touchcancel', handleEnd);
      };
    }
  }, [isActive, handleMouseMove, handleEnd]);

  if (!isMobile) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-8 left-8 z-50 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        touchAction: 'none',
        userSelect: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={knobRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: '50%',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          transform: `translate(${knobPosition.x - size/2}px, ${knobPosition.y - size/2}px)`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          touchAction: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default VirtualJoystick;
