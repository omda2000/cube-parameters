
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SceneObject } from '../types/model';

interface SelectionContextType {
  selectedObjects: SceneObject[];
  selectedObject: SceneObject | null; // Keep for backward compatibility
  selectObject: (object: SceneObject | null) => void;
  selectMultipleObjects: (object: SceneObject, addToSelection?: boolean) => void;
  clearSelection: () => void;
  isSelected: (objectId: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedObjects, setSelectedObjects] = useState<SceneObject[]>([]);

  const selectObject = useCallback((object: SceneObject | null) => {
    if (object) {
      setSelectedObjects([object]);
    } else {
      setSelectedObjects([]);
    }
  }, []);

  const selectMultipleObjects = useCallback((object: SceneObject, addToSelection = false) => {
    setSelectedObjects(prev => {
      if (addToSelection) {
        // Check if object is already selected
        const isAlreadySelected = prev.some(obj => obj.id === object.id);
        if (isAlreadySelected) {
          // Remove from selection
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

  const isSelected = useCallback((objectId: string) => {
    return selectedObjects.some(obj => obj.id === objectId);
  }, [selectedObjects]);

  // For backward compatibility
  const selectedObject = selectedObjects.length > 0 ? selectedObjects[0] : null;

  return (
    <SelectionContext.Provider value={{ 
      selectedObjects,
      selectedObject, 
      selectObject, 
      selectMultipleObjects,
      clearSelection,
      isSelected
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
