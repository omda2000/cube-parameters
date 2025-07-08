
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

  // Build unified scene tree with filtering
  useEffect(() => {
    let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
    
    // Apply selected-only filter FIRST
    if (showSelectedOnly) {
      const selectedIds = new Set(selectedObjects.map(obj => obj.id));
      objects = objects.filter(obj => {
        // Check if object or any of its children are selected
        const checkSelected = (sceneObj: SceneObject): boolean => {
          if (selectedIds.has(sceneObj.id)) return true;
          return sceneObj.children.some(child => checkSelected(child));
        };
        return checkSelected(obj);
      });
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
    // Toggle visibility for the object and all its children
    const newVisibility = !sceneObject.object.visible;
    
    sceneObject.object.traverse((child) => {
      child.visible = newVisibility;
    });
    sceneObject.object.visible = newVisibility;
    
    // Force re-render by updating the scene objects array
    setSceneObjects(prevObjects => [...prevObjects]);
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
      
      // Force re-render
      setSceneObjects([...sceneObjects]);
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
