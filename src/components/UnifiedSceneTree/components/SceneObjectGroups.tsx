
import React, { useState, memo, useCallback, useMemo } from 'react';
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

const SceneObjectGroups = memo(({
  sceneObjects,
  expandedNodes,
  onToggleExpanded,
  onToggleVisibility,
  onObjectSelect,
  onDelete
}: SceneObjectGroupsProps) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  
  // Stable grouped objects with proper memoization
  const groupedObjects = useMemo(() => {
    const grouped = groupSceneObjects(sceneObjects);
    
    // Sort groups by object count for better UX with large models
    const sortedGrouped = {
      models: grouped.models.sort((a, b) => a.name.localeCompare(b.name)),
      meshes: grouped.meshes.sort((a, b) => a.name.localeCompare(b.name)),
      groups: grouped.groups.sort((a, b) => a.name.localeCompare(b.name)),
      primitives: grouped.primitives.sort((a, b) => a.name.localeCompare(b.name)),
      points: grouped.points.sort((a, b) => a.name.localeCompare(b.name)),
      measurements: grouped.measurements.sort((a, b) => a.name.localeCompare(b.name)),
      lights: grouped.lights.sort((a, b) => a.name.localeCompare(b.name)),
      environment: grouped.environment.sort((a, b) => a.name.localeCompare(b.name))
    };
    
    return sortedGrouped;
  }, [sceneObjects]);

  const toggleGroupCollapse = useCallback((groupName: string) => {
    setCollapsedGroups(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(groupName)) {
        newCollapsed.delete(groupName);
      } else {
        newCollapsed.add(groupName);
      }
      return newCollapsed;
    });
  }, []);

  const toggleCategoryVisibility = useCallback((groupName: string, objects: SceneObject[]) => {
    setHiddenCategories(prev => {
      const newHidden = new Set(prev);
      const isCurrentlyHidden = newHidden.has(groupName);
      
      if (isCurrentlyHidden) {
        newHidden.delete(groupName);
      } else {
        newHidden.add(groupName);
      }
      
      // Batch visibility changes to prevent excessive re-renders
      requestAnimationFrame(() => {
        objects.forEach(obj => {
          obj.object.visible = isCurrentlyHidden;
          obj.object.traverse((child) => {
            child.visible = isCurrentlyHidden;
          });
        });
      });
      
      return newHidden;
    });
  }, []);

  const renderGroup = useCallback((title: string, objects: SceneObject[]) => {
    if (objects.length === 0) return null;
    
    const isCollapsed = collapsedGroups.has(title);
    const isCategoryHidden = hiddenCategories.has(title);
    
    return (
      <div key={title} className="mb-2">
        <div className="flex items-center gap-1 px-2 py-1 hover:bg-slate-700/30 rounded transition-colors">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-slate-400 hover:text-slate-200"
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
            className="h-4 w-4 p-0 text-slate-400 hover:text-slate-200 transition-colors"
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
  }, [collapsedGroups, hiddenCategories, expandedNodes, onToggleExpanded, onToggleVisibility, onObjectSelect, onDelete, toggleGroupCollapse, toggleCategoryVisibility]);

  // Calculate total object count for display
  const totalObjects = useMemo(() => {
    return Object.values(groupedObjects).reduce((total, group) => total + group.length, 0);
  }, [groupedObjects]);

  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-400 mb-2 px-2 flex justify-between">
        <span>Hold Ctrl+Click to select multiple objects</span>
        <span>Total: {totalObjects}</span>
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
});

SceneObjectGroups.displayName = 'SceneObjectGroups';

export default SceneObjectGroups;
