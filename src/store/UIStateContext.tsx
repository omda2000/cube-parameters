
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UIState, UIAction } from './types';

const initialUIState: UIState = {
  showControlPanel: false,
  showMeasurePanel: false,
  activeControlTab: 'scene',
  activeTool: 'select',
  isOrthographic: false
};

const uiStateReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_CONTROL_PANEL':
      return { ...state, showControlPanel: action.payload };
    case 'SET_MEASURE_PANEL':
      return { ...state, showMeasurePanel: action.payload };
    case 'SET_ACTIVE_CONTROL_TAB':
      return { ...state, activeControlTab: action.payload };
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload };
    case 'SET_ORTHOGRAPHIC':
      return { ...state, isOrthographic: action.payload };
    default:
      return state;
  }
};

const UIStateContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
} | null>(null);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(uiStateReducer, initialUIState);

  return (
    <UIStateContext.Provider value={{ state, dispatch }}>
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIStateContext = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIStateContext must be used within a UIStateProvider');
  }
  return context;
};
