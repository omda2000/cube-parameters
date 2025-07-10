
import { useState, useRef, useCallback, useEffect } from 'react';

interface StableLoadingStateOptions {
  minLoadingDuration?: number;
  stabilityDelay?: number;
}

export const useStableLoadingState = (
  isActuallyLoading: boolean,
  options: StableLoadingStateOptions = {}
) => {
  const { minLoadingDuration = 500, stabilityDelay = 200 } = options;
  
  const [stableLoading, setStableLoading] = useState(false);
  const [stableNotLoading, setStableNotLoading] = useState(true);
  
  const loadingStartTimeRef = useRef<number | null>(null);
  const stabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
      stabilityTimeoutRef.current = null;
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActuallyLoading) {
      // Loading started
      if (!loadingStartTimeRef.current) {
        loadingStartTimeRef.current = Date.now();
        console.log('StableLoadingState: Loading started');
      }
      
      clearTimeouts();
      setStableLoading(true);
      setStableNotLoading(false);
      
    } else if (loadingStartTimeRef.current) {
      // Loading finished
      const loadingDuration = Date.now() - loadingStartTimeRef.current;
      const remainingMinDuration = Math.max(0, minLoadingDuration - loadingDuration);
      
      console.log('StableLoadingState: Loading finished, stabilizing...', {
        loadingDuration,
        remainingMinDuration
      });
      
      clearTimeouts();
      
      // Ensure minimum loading duration, then add stability delay
      loadingTimeoutRef.current = setTimeout(() => {
        stabilityTimeoutRef.current = setTimeout(() => {
          console.log('StableLoadingState: Setting stable not loading');
          setStableLoading(false);
          setStableNotLoading(true);
          loadingStartTimeRef.current = null;
        }, stabilityDelay);
      }, remainingMinDuration);
    }

    return clearTimeouts;
  }, [isActuallyLoading, minLoadingDuration, stabilityDelay, clearTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimeouts;
  }, [clearTimeouts]);

  return {
    isStableLoading: stableLoading,
    isStableNotLoading: stableNotLoading,
    isInTransition: !stableLoading && !stableNotLoading
  };
};
