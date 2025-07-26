
import { Box } from 'lucide-react';
import type { SceneObject } from '../../../types/model';

interface SceneTreeHeaderProps {
  selectedObjects: SceneObject[];
  onClearSelection: () => void;
}

const SceneTreeHeader = ({ selectedObjects, onClearSelection }: SceneTreeHeaderProps) => {
  return null;
};

export default SceneTreeHeader;
