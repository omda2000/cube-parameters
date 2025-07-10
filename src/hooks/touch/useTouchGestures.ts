
import { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface TouchGestureConfig {
  onPinchZoom?: (scale: number, center: { x: number; y: number }) => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  onThreeFingerTap?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
}

export const useTouchGestures = (
  element: HTMLElement | null,
  controls: OrbitControls | null,
  config: TouchGestureConfig = {}
) => {
  const touchesRef = useRef<Map<number, Touch>>(new Map());
  const gestureStateRef = useRef({
    isPinching: false,
    initialPinchDistance: 0,
    initialPinchCenter: { x: 0, y: 0 },
    lastTapTime: 0,
    longPressTimer: null as NodeJS.Timeout | null,
    swipeStartPos: { x: 0, y: 0 },
    swipeStartTime: 0
  });

  const getTouchDistance = useCallback((touch1: Touch, touch2: Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const getTouchCenter = useCallback((touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const touches = Array.from(event.touches);
    touchesRef.current.clear();
    
    touches.forEach(touch => {
      touchesRef.current.set(touch.identifier, touch);
    });

    const now = Date.now();
    const state = gestureStateRef.current;

    if (touches.length === 1) {
      // Single touch - potential tap or long press
      const touch = touches[0];
      state.swipeStartPos = { x: touch.clientX, y: touch.clientY };
      state.swipeStartTime = now;

      // Long press detection
      state.longPressTimer = setTimeout(() => {
        config.onLongPress?.({ x: touch.clientX, y: touch.clientY });
      }, 500);

      // Double tap detection
      if (now - state.lastTapTime < 300) {
        config.onDoubleTap?.({ x: touch.clientX, y: touch.clientY });
        state.lastTapTime = 0;
      } else {
        state.lastTapTime = now;
      }
    } else if (touches.length === 2) {
      // Two touches - pinch gesture
      state.isPinching = true;
      state.initialPinchDistance = getTouchDistance(touches[0], touches[1]);
      state.initialPinchCenter = getTouchCenter(touches[0], touches[1]);
      
      if (controls) {
        controls.enabled = false;
      }
    } else if (touches.length === 3) {
      // Three finger tap
      config.onThreeFingerTap?.();
    }
  }, [controls, config, getTouchDistance, getTouchCenter]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const touches = Array.from(event.touches);
    const state = gestureStateRef.current;

    // Clear long press if moving
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }

    if (touches.length === 2 && state.isPinching) {
      const currentDistance = getTouchDistance(touches[0], touches[1]);
      const currentCenter = getTouchCenter(touches[0], touches[1]);
      
      if (state.initialPinchDistance > 0) {
        const scale = currentDistance / state.initialPinchDistance;
        config.onPinchZoom?.(scale, currentCenter);
      }
    }
  }, [config, getTouchDistance, getTouchCenter]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const state = gestureStateRef.current;
    
    // Clear long press timer
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }

    const touches = Array.from(event.touches);
    
    if (touches.length === 0) {
      // All touches ended
      const now = Date.now();
      const timeDiff = now - state.swipeStartTime;
      
      // Check for swipe gesture
      if (timeDiff < 300 && timeDiff > 50) {
        const changedTouch = event.changedTouches[0];
        if (changedTouch) {
          const deltaX = changedTouch.clientX - state.swipeStartPos.x;
          const deltaY = changedTouch.clientY - state.swipeStartPos.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          
          if (distance > 50) {
            const velocity = distance / timeDiff;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              config.onSwipe?.(deltaX > 0 ? 'right' : 'left', velocity);
            } else {
              config.onSwipe?.(deltaY > 0 ? 'down' : 'up', velocity);
            }
          }
        }
      }
      
      state.isPinching = false;
      
      if (controls) {
        controls.enabled = true;
      }
    } else if (touches.length < 2) {
      // Less than 2 touches, stop pinching
      state.isPinching = false;
      
      if (controls) {
        controls.enabled = true;
      }
    }

    touchesRef.current.clear();
    touches.forEach(touch => {
      touchesRef.current.set(touch.identifier, touch);
    });
  }, [controls, config]);

  useEffect(() => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [element, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isGesturing: gestureStateRef.current.isPinching
  };
};
