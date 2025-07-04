
// This file is now deprecated - selection is handled by SelectionContext
export const useSelection = () => {
  console.warn('useSelection hook is deprecated. Use useSelectionContext instead.');
  return {
    selectedObject: null,
    selectObject: () => {},
    clearSelection: () => {},
    cleanup: () => {}
  };
};
