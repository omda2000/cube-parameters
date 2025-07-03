
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SceneObject } from '../types/model';

interface SelectionContextType {
  selectedObjects: SceneObject[];
  selectedObject: SceneObject | null;
  selectObject: (object: SceneObject | null, addToSelection?: boolean) => void;
  clearSelection: () => void;
  removeFromSelection: (objectId: string) => void;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedObjects, setSelectedObjects] = useState<SceneObject[]>([]);

  const selectObject = useCallback((object: SceneObject | null, addToSelection = false) => {
    if (!object) {
      setSelectedObjects([]);
      return;
    }

    setSelectedObjects(prev => {
      if (addToSelection) {
        // Check if object is already selected
        const isAlreadySelected = prev.some(obj => obj.id === object.id);
        if (isAlreadySelected) {
          // Remove from selection if already selected
          return prev.filter(obj => obj.id !== object.id);
        } else {
          // Add to selection
          return [...prev, object];
        }
      } else {
        // Replace selection
        return [object];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedObjects([]);
  }, []);

  const removeFromSelection = useCallback((objectId: string) => {
    setSelectedObjects(prev => prev.filter(obj => obj.id !== objectId));
  }, []);

  // For backward compatibility, return the first selected object as selectedObject
  const selectedObject = selectedObjects.length > 0 ? selectedObjects[0] : null;

  return (
    <SelectionContext.Provider value={{ 
      selectedObjects, 
      selectedObject, 
      selectObject, 
      clearSelection, 
      removeFromSelection 
    }}>
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
