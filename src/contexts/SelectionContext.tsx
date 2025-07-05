
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SceneObject } from '../types/model';

interface SelectionContextType {
  selectedObject: SceneObject | null;
  selectObject: (object: SceneObject | null) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);

  const selectObject = useCallback((object: SceneObject | null) => {
    setSelectedObject(object);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedObject(null);
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedObject, selectObject, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
};
