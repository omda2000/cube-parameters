
import { useEffect } from 'react';
import type { SceneObject } from '../types/model';

interface ViewerKeyboardShortcutsProps {
  onClearSelection: () => void;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  selectedObject: SceneObject | null;
}

export const useViewerKeyboardShortcuts = ({
  onClearSelection,
  onZoomAll,
  onZoomToSelected,
  selectedObject
}: ViewerKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'escape':
          onClearSelection();
          event.preventDefault();
          break;
        case 'a':
          onZoomAll();
          event.preventDefault();
          break;
        case 'f':
          if (selectedObject) {
            onZoomToSelected();
            event.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClearSelection, onZoomAll, onZoomToSelected, selectedObject]);
};
