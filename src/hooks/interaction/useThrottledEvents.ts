
import { useCallback } from 'react';

export const useThrottledEvents = () => {
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

  return { throttledMouseMove };
};
