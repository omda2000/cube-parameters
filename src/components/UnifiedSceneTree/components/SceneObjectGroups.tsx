
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
      <div key={title} className="mb-1">
        <div 
          className="flex items-center gap-1 px-1 py-0.5 hover:bg-gray-100 rounded text-gray-700"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => toggleGroupCollapse(title)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-2.5 w-2.5" />
            ) : (
              <ChevronDown className="h-2.5 w-2.5" />
            )}
          </Button>
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide flex-1">
            {title} ({objects.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => toggleCategoryVisibility(title, objects)}
            title={`${isCategoryHidden ? 'Show' : 'Hide'} all ${title.toLowerCase()}`}
          >
            {isCategoryHidden ? (
              <EyeOff className="h-2.5 w-2.5" />
            ) : (
              <Eye className="h-2.5 w-2.5" />
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
