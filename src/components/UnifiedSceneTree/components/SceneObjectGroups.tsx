
import type { SceneObject } from '../../../types/model';
import SceneObjectGroup from './SceneObjectGroup';
import { groupSceneObjects } from '../utils/sceneObjectBuilder';

interface SceneObjectGroupsProps {
  sceneObjects: SceneObject[];
  expandedNodes: Set<string>;
  onToggleExpanded: (nodeId: string) => void;
  onToggleVisibility: (sceneObject: SceneObject) => void;
  onObjectSelect: (sceneObject: SceneObject, isMultiSelect?: boolean) => void;
  onDelete: (sceneObject: SceneObject, event: React.MouseEvent) => void;
}

const SceneObjectGroups = ({
  sceneObjects,
  expandedNodes,
  onToggleExpanded,
  onToggleVisibility,
  onObjectSelect,
  onDelete
}: SceneObjectGroupsProps) => {
  const groupedObjects = groupSceneObjects(sceneObjects);

  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-400 mb-2 px-2">
        Hold Ctrl+Click to select multiple objects
      </div>
      
      <SceneObjectGroup
        title="Models"
        objects={groupedObjects.models}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Meshes"
        objects={groupedObjects.meshes}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Groups"
        objects={groupedObjects.groups}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Primitives"
        objects={groupedObjects.primitives}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Points"
        objects={groupedObjects.points}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Measurements"
        objects={groupedObjects.measurements}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Lights"
        objects={groupedObjects.lights}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
      
      <SceneObjectGroup
        title="Environment"
        objects={groupedObjects.environment}
        expandedNodes={expandedNodes}
        onToggleExpanded={onToggleExpanded}
        onToggleVisibility={onToggleVisibility}
        onObjectSelect={onObjectSelect}
        onDelete={onDelete}
      />
    </div>
  );
};

export default SceneObjectGroups;
