
import { useState, useEffect } from 'react';

type BreakpointType = 'mobile' | 'tablet' | 'desktop' | 'large';

export const useResponsiveMode = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointType>('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [panelWidth, setPanelWidth] = useState(384); // Default desktop width

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setBreakpoint('mobile');
        setIsMobile(true);
        setPanelWidth(280);
      } else if (width < 1024) {
        setBreakpoint('tablet');
        setIsMobile(false);
        setPanelWidth(320);
      } else if (width < 1440) {
        setBreakpoint('desktop');
        setIsMobile(false);
        setPanelWidth(384);
      } else {
        setBreakpoint('large');
        setIsMobile(false);
        setPanelWidth(420);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    panelWidth,
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'large',
    isLarge: breakpoint === 'large'
  };
};
