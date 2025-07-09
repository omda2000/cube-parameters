
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
    isLoading,
    isStable,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete,
    clearSelection
  } = useSceneTreeState(scene, loadedModels, showPrimitives, searchQuery, showSelectedOnly);

  console.log('UnifiedSceneTree: Render state -', { 
    isLoading, 
    isStable,
    sceneObjectsCount: sceneObjects.length,
    hasScene: !!scene,
    sceneChildrenCount: scene?.children.length || 0
  });

  // Determine display state with stability check
  const shouldShowLoading = isLoading && (!isStable || sceneObjects.length === 0);
  const shouldShowEmpty = !isLoading && isStable && sceneObjects.length === 0 && !!scene;
  const shouldShowObjects = sceneObjects.length > 0 && (isStable || !isLoading);

  return (
    <div className="h-full flex flex-col">
      <SceneTreeHeader 
        selectedObjects={selectedObjects}
        onClearSelection={clearSelection}
      />
      <div className="flex-1 overflow-y-auto bg-slate-800/30 border border-slate-600 rounded">
        {shouldShowLoading ? (
          <div className="p-4 text-center text-slate-400">
            <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-xs">Loading scene objects...</p>
          </div>
        ) : shouldShowEmpty ? (
          <div className="p-2">
            <EmptySceneState />
          </div>
        ) : shouldShowObjects ? (
          <div className="p-2 min-h-0">
            <SceneObjectGroups
              sceneObjects={sceneObjects}
              expandedNodes={expandedNodes}
              onToggleExpanded={toggleExpanded}
              onToggleVisibility={toggleVisibility}
              onObjectSelect={handleObjectSelect}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="p-4 text-center text-slate-400">
            <p className="text-xs">Initializing scene...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedSceneTree;
