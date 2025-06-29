
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface UIState {
  showControlPanel: boolean;
  showMeasurePanel: boolean;
  activeControlTab: string;
  activeTool: 'select' | 'point' | 'measure' | 'move';
  isOrthographic: boolean;
}

type UIAction = 
  | { type: 'SET_SHOW_CONTROL_PANEL'; payload: boolean }
  | { type: 'SET_SHOW_MEASURE_PANEL'; payload: boolean }
  | { type: 'SET_ACTIVE_CONTROL_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TOOL'; payload: 'select' | 'point' | 'measure' | 'move' }
  | { type: 'SET_IS_ORTHOGRAPHIC'; payload: boolean };

const initialState: UIState = {
  showControlPanel: false,
  showMeasurePanel: false,
  activeControlTab: 'scene',
  activeTool: 'select',
  isOrthographic: false
};

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_SHOW_CONTROL_PANEL':
      return { ...state, showControlPanel: action.payload };
    case 'SET_SHOW_MEASURE_PANEL':
      return { ...state, showMeasurePanel: action.payload };
    case 'SET_ACTIVE_CONTROL_TAB':
      return { ...state, activeControlTab: action.payload };
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload };
    case 'SET_IS_ORTHOGRAPHIC':
      return { ...state, isOrthographic: action.payload };
    default:
      return state;
  }
};

interface UIStateContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const useUIStateContext = () => {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIStateContext must be used within a UIStateProvider');
  }
  return context;
};

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  return (
    <UIStateContext.Provider value={{ state, dispatch }}>
      {children}
    </UIStateContext.Provider>
  );
};
