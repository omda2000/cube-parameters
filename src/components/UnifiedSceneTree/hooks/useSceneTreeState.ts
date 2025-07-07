
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import type { LoadedModel, SceneObject } from '../../../types/model';
import { buildSceneObjects } from '../utils/sceneObjectBuilder';

export const useSceneTreeState = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  searchQuery: string = '',
  showSelectedOnly: boolean = false
) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();

  // Build unified scene tree with filtering and selection sync
  useEffect(() => {
    console.log('Building scene objects with selection sync:', { 
      showSelectedOnly, 
      selectedObjectsCount: selectedObjects.length,
      selectedObjectIds: selectedObjects.map(obj => obj.id)
    });
    
    // Build objects with current selection state
    let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
    
    // Apply selected-only filter FIRST
    if (showSelectedOnly && selectedObjects.length > 0) {
      console.log('Filtering for selected objects only');
      objects = objects.filter(obj => {
        const isSelected = selectedObjects.some(selected => selected.id === obj.id);
        console.log(`Object ${obj.name} (${obj.id}) is selected:`, isSelected);
        return isSelected;
      });
      console.log('Filtered objects count:', objects.length);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      objects = objects.filter(obj => 
        obj.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setSceneObjects(objects);
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly]);

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
    // Update the scene object state to reflect the change
    const updatedObjects = sceneObjects.map(obj => 
      obj.id === sceneObject.id ? { ...obj, visible: obj.object.visible } : obj
    );
    setSceneObjects(updatedObjects);
  };

  const handleObjectSelect = (sceneObject: SceneObject, isMultiSelect?: boolean) => {
    if (isMultiSelect) {
      toggleSelection(sceneObject);
    } else {
      selectObject(sceneObject);
    }
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
      
      // Force re-render by updating the objects list
      setSceneObjects(prev => prev.filter(obj => obj.id !== sceneObject.id));
    }
  };

  return {
    expandedNodes,
    sceneObjects,
    selectedObjects,
    toggleExpanded,
    toggleVisibility,
    handleObjectSelect,
    handleDelete,
    clearSelection
  };
};
