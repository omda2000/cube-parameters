
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
    <div className="space-y-2">
      <SceneTreeHeader 
        selectedObjects={selectedObjects}
        onClearSelection={clearSelection}
      />
      <div className="max-h-96 overflow-y-auto border border-slate-600 rounded bg-slate-800/30">
        <div className="p-2">
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
