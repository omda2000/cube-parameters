
import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';
import * as THREE from 'three';
import { useSelectionContext } from '../../contexts/SelectionContext';
import type { LoadedModel, SceneObject } from '../../types/model';
import SceneObjectGroup from './components/SceneObjectGroup';
import { buildSceneObjects, groupSceneObjects } from './utils/sceneObjectBuilder';

interface UnifiedSceneTreeProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  showPrimitives: boolean;
  scene: THREE.Scene | null;
}

const UnifiedSceneTree = ({ 
  loadedModels, 
  currentModel, 
  showPrimitives,
  scene
}: UnifiedSceneTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const { selectedObjects, selectMultipleObjects } = useSelectionContext();

  // Build unified scene tree
  useEffect(() => {
    const objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
    setSceneObjects(objects);
  }, [scene, loadedModels, showPrimitives, selectedObjects]);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleVisibility = (sceneObject: SceneObject) => {
    sceneObject.object.visible = !sceneObject.object.visible;
    setSceneObjects([...sceneObjects]);
  };

  const handleObjectSelect = (sceneObject: SceneObject, addToSelection = false) => {
    selectMultipleObjects(sceneObject, addToSelection);
  };

  const handleDelete = (sceneObject: SceneObject, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (sceneObject.type === 'point' || sceneObject.type === 'measurement') {
      // Remove from scene
      scene?.remove(sceneObject.object);
      
      // Dispose geometry and material for measurement groups
      if (sceneObject.type === 'measurement' && sceneObject.object instanceof THREE.Group) {
        sceneObject.object.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material?.dispose();
            }
          } else if (child instanceof THREE.Line) {
            child.geometry?.dispose();
            (child.material as THREE.Material)?.dispose();
          }
        });
      }
      
      // Dispose geometry and material for points
      if (sceneObject.type === 'point' && sceneObject.object instanceof THREE.Mesh) {
        sceneObject.object.geometry?.dispose();
        if (Array.isArray(sceneObject.object.material)) {
          sceneObject.object.material.forEach(mat => mat.dispose());
        } else {
          sceneObject.object.material?.dispose();
        }
      }
      
      // Force re-render
      setSceneObjects([...sceneObjects]);
    }
  };

  // Group objects by type for better organization
  const groupedObjects = groupSceneObjects(sceneObjects);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        <Box className="h-4 w-4" />
        Scene Hierarchy
        {selectedObjects.length > 1 && (
          <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
            {selectedObjects.length} selected
          </span>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto border border-slate-600 rounded bg-slate-800/30">
        <div className="p-2">
          {sceneObjects.length === 0 ? (
            <div className="text-center py-4 text-slate-400">
              <Box className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No objects in scene</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xs text-slate-500 mb-2">
                Tip: Hold Ctrl+Click to select multiple objects
              </div>
              
              <SceneObjectGroup
                title="Models"
                objects={groupedObjects.models}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Meshes"
                objects={groupedObjects.meshes}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Groups"
                objects={groupedObjects.groups}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Primitives"
                objects={groupedObjects.primitives}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Points"
                objects={groupedObjects.points}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Measurements"
                objects={groupedObjects.measurements}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Lights"
                objects={groupedObjects.lights}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
              
              <SceneObjectGroup
                title="Environment"
                objects={groupedObjects.environment}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
                onObjectSelect={handleObjectSelect}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSceneTree;
