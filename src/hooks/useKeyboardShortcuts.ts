
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onToggleControlPanel?: () => void;
  onZoomAll?: () => void;
  onZoomToSelected?: () => void;
  onResetView?: () => void;
}

export const useKeyboardShortcuts = ({
  onToggleControlPanel,
  onZoomAll,
  onZoomToSelected,
  onResetView
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'tab':
          if (onToggleControlPanel) {
            onToggleControlPanel();
            event.preventDefault();
          }
          break;
        case 'a':
          if (onZoomAll) {
            onZoomAll();
            event.preventDefault();
          }
          break;
        case 'f':
          if (onZoomToSelected) {
            onZoomToSelected();
            event.preventDefault();
          }
          break;
        case 'r':
          if (onResetView) {
            onResetView();
            event.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleControlPanel, onZoomAll, onZoomToSelected, onResetView]);
};
