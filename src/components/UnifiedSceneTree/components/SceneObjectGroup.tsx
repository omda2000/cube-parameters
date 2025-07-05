
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { SceneObject } from '../../../types/model';
import SceneObjectNode from './SceneObjectNode';

interface SceneObjectGroupProps {
  title: string;
  objects: SceneObject[];
  expandedNodes: Set<string>;
  selectedObject: SceneObject | null;
  onToggleExpanded: (nodeId: string) => void;
  onToggleVisibility: (sceneObject: SceneObject) => void;
  onObjectSelect: (sceneObject: SceneObject) => void;
  onDelete: (sceneObject: SceneObject, event: React.MouseEvent) => void;
}

const SceneObjectGroup = ({
  title,
  objects,
  expandedNodes,
  selectedObject,
  onToggleExpanded,
  onToggleVisibility,
  onObjectSelect,
  onDelete
}: SceneObjectGroupProps) => {
  const groupId = `group_${title.toLowerCase()}`;
  const isExpanded = expandedNodes.has(groupId);

  if (objects.length === 0) return null;

  return (
    <div className="mb-2">
      <div 
        className="flex items-center gap-2 py-1 px-2 text-xs font-medium text-slate-400 hover:text-slate-300 cursor-pointer"
        onClick={() => onToggleExpanded(groupId)}
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <span>{title} ({objects.length})</span>
      </div>
      
      {isExpanded && (
        <div className="ml-2">
          {objects.map(sceneObject => (
            <SceneObjectNode
              key={sceneObject.id}
              sceneObject={sceneObject}
              level={0}
              expandedNodes={expandedNodes}
              selectedObject={selectedObject}
              onToggleExpanded={onToggleExpanded}
              onToggleVisibility={onToggleVisibility}
              onObjectSelect={onObjectSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SceneObjectGroup;
