
import type { SceneObject } from '../../../types/model';
import SceneObjectNode from './SceneObjectNode';

interface SceneObjectGroupProps {
  title: string;
  objects: SceneObject[];
  expandedNodes: Set<string>;
  onToggleExpanded: (nodeId: string) => void;
  onToggleVisibility: (sceneObject: SceneObject) => void;
  onObjectSelect: (sceneObject: SceneObject, isMultiSelect?: boolean) => void;
  onDelete: (sceneObject: SceneObject, event: React.MouseEvent) => void;
}

const SceneObjectGroup = ({
  title,
  objects,
  expandedNodes,
  onToggleExpanded,
  onToggleVisibility,
  onObjectSelect,
  onDelete
}: SceneObjectGroupProps) => {
  if (objects.length === 0) return null;

  return (
    <div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 px-2">
        {title} ({objects.length})
      </div>
      {objects.map(obj => (
        <SceneObjectNode
          key={obj.id}
          sceneObject={obj}
          level={0}
          expandedNodes={expandedNodes}
          onToggleExpanded={onToggleExpanded}
          onToggleVisibility={onToggleVisibility}
          onObjectSelect={onObjectSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SceneObjectGroup;
