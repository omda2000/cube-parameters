
import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
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
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
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

  const toggleCategoryVisibility = (groupName: string, objects: SceneObject[]) => {
    const newHidden = new Set(hiddenCategories);
    const isCurrentlyHidden = newHidden.has(groupName);
    
    if (isCurrentlyHidden) {
      newHidden.delete(groupName);
    } else {
      newHidden.add(groupName);
    }
    setHiddenCategories(newHidden);

    // Toggle visibility for all objects in the category
    objects.forEach(obj => {
      obj.object.visible = isCurrentlyHidden;
    });
  };

  const renderGroup = (title: string, objects: SceneObject[]) => {
    if (objects.length === 0) return null;
    
    const isCollapsed = collapsedGroups.has(title);
    const isCategoryHidden = hiddenCategories.has(title);
    
    return (
      <div key={title} className="mb-2">
        <div 
          className="flex items-center gap-1 px-2 py-1 hover:bg-slate-700/30 rounded"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-slate-400"
            onClick={() => toggleGroupCollapse(title)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide flex-1">
            {title} ({objects.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-slate-400 hover:text-slate-200"
            onClick={() => toggleCategoryVisibility(title, objects)}
            title={`${isCategoryHidden ? 'Show' : 'Hide'} all ${title.toLowerCase()}`}
          >
            {isCategoryHidden ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
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
      
      {renderGroup("Geometry", groupedObjects.geometry)}
      {renderGroup("Points", groupedObjects.points)}
      {renderGroup("Measurements", groupedObjects.measurements)}
      {renderGroup("Lights", groupedObjects.lights)}
      {renderGroup("Environment", groupedObjects.environment)}
    </div>
  );
};

export default SceneObjectGroups;
