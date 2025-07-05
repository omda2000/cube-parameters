
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const groupedObjects = groupSceneObjects(sceneObjects);

  const toggleGroupCollapse = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };

  const renderGroup = (title: string, objects: SceneObject[]) => {
    if (objects.length === 0) return null;
    
    const isCollapsed = collapsedGroups.has(title);
    
    return (
      <div key={title} className="mb-2">
        <div 
          className="flex items-center gap-1 px-2 py-1 hover:bg-slate-700/30 rounded cursor-pointer"
          onClick={() => toggleGroupCollapse(title)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-slate-400"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {title} ({objects.length})
          </span>
        </div>
        
        {!isCollapsed && (
          <SceneObjectGroup
            title={title}
            objects={objects}
            expandedNodes={expandedNodes}
            onToggleExpanded={onToggleExpanded}
            onToggleVisibility={onToggleVisibility}
            onObjectSelect={onObjectSelect}
            onDelete={onDelete}
            hideTitle={true}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-400 mb-2 px-2">
        Hold Ctrl+Click to select multiple objects
      </div>
      
      {renderGroup("Models", groupedObjects.models)}
      {renderGroup("Meshes", groupedObjects.meshes)}
      {renderGroup("Groups", groupedObjects.groups)}
      {renderGroup("Primitives", groupedObjects.primitives)}
      {renderGroup("Points", groupedObjects.points)}
      {renderGroup("Measurements", groupedObjects.measurements)}
      {renderGroup("Lights", groupedObjects.lights)}
      {renderGroup("Environment", groupedObjects.environment)}
    </div>
  );
};

export default SceneObjectGroups;
