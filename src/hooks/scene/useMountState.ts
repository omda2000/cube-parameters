
import { useRef, useCallback, useState } from 'react';

export const useMountState = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMountReady, setIsMountReady] = useState(false);

  const mountCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      mountRef.current = node;
      // Use a small delay to ensure the element is fully mounted
      setTimeout(() => {
        setIsMountReady(true);
        console.log('Mount element ready:', node.clientWidth, 'x', node.clientHeight);
      }, 10);
    } else {
      mountRef.current = null;
      setIsMountReady(false);
      console.log('Mount element unmounted');
    }
  }, []);

  return {
    mountRef,
    mountCallback,
    isMountReady
  };
};
