
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import * as THREE from 'three';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import type { SceneObject } from '../../../types/model';
import NodeIcon from './NodeIcon';

interface SceneObjectNodeProps {
  sceneObject: SceneObject;
  level: number;
  expandedNodes: Set<string>;
  onToggleExpanded: (nodeId: string) => void;
  onToggleVisibility: (sceneObject: SceneObject) => void;
  onObjectSelect: (sceneObject: SceneObject, isMultiSelect?: boolean) => void;
  onDelete: (sceneObject: SceneObject, event: React.MouseEvent) => void;
}

const SceneObjectNode = ({
  sceneObject,
  level,
  expandedNodes,
  onToggleExpanded,
  onToggleVisibility,
  onObjectSelect,
  onDelete
}: SceneObjectNodeProps) => {
  const { isSelected } = useSelectionContext();
  
  const isExpanded = expandedNodes.has(sceneObject.id);
  const hasChildren = sceneObject.children.length > 0;
  const paddingLeft = level * 16;
  const isObjectSelected = isSelected(sceneObject);
  const isDeletable = sceneObject.type === 'point' || sceneObject.type === 'measurement';

  const handleClick = (event: React.MouseEvent) => {
    const isCtrlClick = event.ctrlKey || event.metaKey;
    onObjectSelect(sceneObject, isCtrlClick);
  };

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded text-sm cursor-pointer ${
          isObjectSelected ? 'bg-blue-50 border border-blue-200' : ''
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
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
          
          <NodeIcon type={sceneObject.type} objectType={sceneObject.object?.userData?.type} />
          
          <span className={`truncate flex-1 ${isObjectSelected ? 'text-blue-700 font-medium' : 'text-gray-900'}`}>
            {sceneObject.name}
          </span>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
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
            
            {isDeletable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                onClick={(e) => onDelete(sceneObject, e)}
                title="Delete"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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
