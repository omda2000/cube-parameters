
import { useCallback } from 'react';
import { useUIStateContext } from '../../store/UIStateContext';

export const useUIState = () => {
  const { state, dispatch } = useUIStateContext();

  const setShowControlPanel = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_CONTROL_PANEL', payload: show });
  }, [dispatch]);

  const setShowMeasurePanel = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_MEASURE_PANEL', payload: show });
  }, [dispatch]);

  const setActiveControlTab = useCallback((tab: string) => {
    dispatch({ type: 'SET_ACTIVE_CONTROL_TAB', payload: tab });
  }, [dispatch]);

  const setActiveTool = useCallback((tool: 'select' | 'point' | 'measure' | 'move') => {
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool });
  }, [dispatch]);

  const setIsOrthographic = useCallback((orthographic: boolean) => {
    dispatch({ type: 'SET_IS_ORTHOGRAPHIC', payload: orthographic });
  }, [dispatch]);

  return {
    ...state,
    setShowControlPanel,
    setShowMeasurePanel,
    setActiveControlTab,
    setActiveTool,
    setIsOrthographic
  };
};
