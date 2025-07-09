
import { useState, useRef, useCallback } from 'react';

interface UseStableLoadingStateOptions {
  minLoadingDuration?: number;
  debounceDelay?: number;
}

export const useStableLoadingState = (options: UseStableLoadingStateOptions = {}) => {
  const { minLoadingDuration = 500, debounceDelay = 150 } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isStable, setIsStable] = useState(true);
  const loadingStartTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  const startLoading = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    if (!isLoading) {
      loadingStartTimeRef.current = Date.now();
      setIsLoading(true);
      setIsStable(false);
    }
  }, [isLoading]);
  
  const finishLoading = useCallback(() => {
    if (!isLoading) return;
    
    const elapsed = Date.now() - loadingStartTimeRef.current;
    const remainingTime = Math.max(0, minLoadingDuration - elapsed);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      
      // Add a small delay before marking as stable to prevent flickering
      setTimeout(() => {
        setIsStable(true);
      }, debounceDelay);
    }, remainingTime);
  }, [isLoading, minLoadingDuration, debounceDelay]);
  
  return {
    isLoading,
    isStable,
    startLoading,
    finishLoading
  };
};
