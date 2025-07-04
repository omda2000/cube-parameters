import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, EyeOff, Box, Triangle } from 'lucide-react';
import * as THREE from 'three';

interface SceneNode {
  id: string;
  name: string;
  type: 'Group' | 'Mesh' | 'Object3D';
  object: THREE.Object3D;
  children: SceneNode[];
  visible: boolean;
  parent?: SceneNode;
}

interface SceneTreeViewProps {
  model: {
    id: string;
    name: string;
    object: THREE.Group;
  } | null;
}

const SceneTreeView = ({ model }: SceneTreeViewProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  if (!model) {
    return (
      <div className="text-center py-4 text-slate-400">
        <Box className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No model loaded</p>
      </div>
    );
  }

  const buildSceneTree = (object: THREE.Object3D, parentId = ''): SceneNode => {
    const nodeId = `${parentId}_${object.uuid}`;
    const node: SceneNode = {
      id: nodeId,
      name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
      type: object.type as 'Group' | 'Mesh' | 'Object3D',
      object,
      children: [],
      visible: object.visible
    };

    if (object.children.length > 0) {
      node.children = object.children.map(child => {
        const childNode = buildSceneTree(child, nodeId);
        childNode.parent = node;
        return childNode;
      });
    }

    return node;
  };

  const rootNode = buildSceneTree(model.object);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleVisibility = (node: SceneNode) => {
    node.object.visible = !node.object.visible;
    // Force re-render by updating a state
    setExpandedNodes(new Set(expandedNodes));
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Mesh':
        return <Triangle className="h-4 w-4 text-green-400" />;
      case 'Group':
        return <Box className="h-4 w-4 text-blue-400" />;
      default:
        return <Box className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderNode = (node: SceneNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const paddingLeft = level * 16;

    return (
      <div key={node.id}>
        <div 
          className="flex items-center py-1 px-2 hover:bg-slate-700/30 rounded text-sm"
          style={{ paddingLeft }}
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400"
                onClick={() => toggleExpanded(node.id)}
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
            
            {getNodeIcon(node.type)}
            
            <span className="text-slate-200 truncate flex-1">
              {node.name}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => toggleVisibility(node)}
            >
              {node.object.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        <Box className="h-4 w-4" />
        Scene Hierarchy
      </div>
      <div className="max-h-64 overflow-y-auto border border-slate-600 rounded bg-slate-800/30">
        {renderNode(rootNode)}
      </div>
    </div>
  );
};

export default SceneTreeView;
