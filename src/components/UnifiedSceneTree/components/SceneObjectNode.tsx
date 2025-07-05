
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { SceneObject } from '../../../types/model';
import NodeIcon from './NodeIcon';

interface SceneObjectNodeProps {
  sceneObject: SceneObject;
  level: number;
  expandedNodes: Set<string>;
  selectedObject: SceneObject | null;
  onToggleExpanded: (nodeId: string) => void;
  onToggleVisibility: (sceneObject: SceneObject) => void;
  onObjectSelect: (sceneObject: SceneObject) => void;
  onDelete: (sceneObject: SceneObject, event: React.MouseEvent) => void;
}

const SceneObjectNode = ({
  sceneObject,
  level,
  expandedNodes,
  selectedObject,
  onToggleExpanded,
  onToggleVisibility,
  onObjectSelect,
  onDelete
}: SceneObjectNodeProps) => {
  const isExpanded = expandedNodes.has(sceneObject.id);
  const hasChildren = sceneObject.children.length > 0;
  const isSelected = selectedObject?.id === sceneObject.id;
  const paddingLeft = level * 16;

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 rounded text-sm cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-indigo-600/40 hover:bg-indigo-600/50' 
            : 'hover:bg-slate-700/30'
        }`}
        style={{ paddingLeft }}
        onClick={() => onObjectSelect(sceneObject)}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(sceneObject.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          
          <NodeIcon type={sceneObject.type} />
          
          <span className={`truncate flex-1 ${isSelected ? 'text-white font-medium' : 'text-slate-200'}`}>
            {sceneObject.name}
          </span>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(sceneObject);
              }}
            >
              {sceneObject.object.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
            
            {(sceneObject.type === 'point' || sceneObject.type === 'measurement') && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                onClick={(e) => onDelete(sceneObject, e)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {sceneObject.children.map(child => (
            <SceneObjectNode
              key={child.id}
              sceneObject={child}
              level={level + 1}
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

export default SceneObjectNode;
