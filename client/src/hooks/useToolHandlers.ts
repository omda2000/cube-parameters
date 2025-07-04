import { useCallback } from 'react';

export const useToolHandlers = () => {
  const handleToolSelect = useCallback((tool: 'select' | 'point' | 'measure' | 'move') => {
    console.log('Tool selected:', tool);
  }, []);

  return {
    handleToolSelect,
  };
};