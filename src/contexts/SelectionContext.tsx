
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SceneObject } from '../types/model';

interface SelectionContextType {
  selectedObjects: SceneObject[];
  selectedObject: SceneObject | null; // Keep for backward compatibility
  selectObject: (object: SceneObject | null) => void;
  selectMultipleObjects: (objects: SceneObject[]) => void;
  addToSelection: (object: SceneObject) => void;
  removeFromSelection: (object: SceneObject) => void;
  toggleSelection: (object: SceneObject) => void;
  clearSelection: () => void;
  isSelected: (object: SceneObject) => boolean;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedObjects, setSelectedObjects] = useState<SceneObject[]>([]);

  const selectObject = useCallback((object: SceneObject | null) => {
    console.log('SelectionContext: selectObject called with:', object);
    if (object) {
      setSelectedObjects([object]);
    } else {
      setSelectedObjects([]);
    }
  }, []);

  const selectMultipleObjects = useCallback((objects: SceneObject[]) => {
    setSelectedObjects(objects);
  }, []);

  const addToSelection = useCallback((object: SceneObject) => {
    setSelectedObjects(prev => {
      if (!prev.find(obj => obj.id === object.id)) {
        return [...prev, object];
      }
      return prev;
    });
  }, []);

  const removeFromSelection = useCallback((object: SceneObject) => {
    setSelectedObjects(prev => prev.filter(obj => obj.id !== object.id));
  }, []);

  const toggleSelection = useCallback((object: SceneObject) => {
    setSelectedObjects(prev => {
      const isCurrentlySelected = prev.find(obj => obj.id === object.id);
      if (isCurrentlySelected) {
        return prev.filter(obj => obj.id !== object.id);
      } else {
        return [...prev, object];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    console.log('SelectionContext: clearSelection called');
    setSelectedObjects([]);
  }, []);

  const isSelected = useCallback((object: SceneObject) => {
    return selectedObjects.some(obj => obj.id === object.id);
  }, [selectedObjects]);

  // Backward compatibility
  const selectedObject = selectedObjects.length > 0 ? selectedObjects[0] : null;

  return (
    <SelectionContext.Provider value={{ 
      selectedObjects,
      selectedObject,
      selectObject,
      selectMultipleObjects,
      addToSelection,
      removeFromSelection,
      toggleSelection,
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
