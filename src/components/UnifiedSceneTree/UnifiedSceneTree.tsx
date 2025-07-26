
import * as THREE from 'three';
import type { LoadedModel } from '../../types/model';
import SceneTreeHeader from './components/SceneTreeHeader';
import EmptySceneState from './components/EmptySceneState';
import SceneObjectGroups from './components/SceneObjectGroups';
import { useSceneTreeState } from './hooks/useSceneTreeState';

interface UnifiedSceneTreeProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  showPrimitives: boolean;
  scene: THREE.Scene | null;
  searchQuery?: string;
  showSelectedOnly?: boolean;
}

const UnifiedSceneTree = ({ 
  loadedModels, 
  currentModel, 
  showPrimitives,
  scene,
  searchQuery = '',
  showSelectedOnly = false
}: UnifiedSceneTreeProps) => {
  const {
    expandedNodes,
    sceneObjects,
    selectedObjects,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete,
    clearSelection
  } = useSceneTreeState(scene, loadedModels, showPrimitives, searchQuery, showSelectedOnly);

  return (
    <div className="h-full flex flex-col">
      <SceneTreeHeader 
        selectedObjects={selectedObjects}
        onClearSelection={clearSelection}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded">
        <div className="p-1">
          {sceneObjects.length === 0 ? (
            <EmptySceneState />
          ) : (
            <SceneObjectGroups
              sceneObjects={sceneObjects}
              expandedNodes={expandedNodes}
              onToggleExpanded={toggleExpanded}
              onToggleVisibility={toggleVisibility}
              onObjectSelect={handleObjectSelect}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSceneTree;
