
import { useState, useEffect, useCallback } from 'react';
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
  const [forceUpdate, setForceUpdate] = useState(0);
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();

  // Force update function to trigger re-renders
  const triggerUpdate = useCallback(() => {
    console.log('Triggering scene tree update');
    setForceUpdate(prev => prev + 1);
  }, []);

  // Build unified scene tree with filtering
  useEffect(() => {
    console.log('Building scene objects', { 
      sceneExists: !!scene, 
      showSelectedOnly, 
      selectedObjects: selectedObjects.length, 
      searchQuery,
      loadedModelsCount: loadedModels.length
    });
    
    let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
    console.log('Built scene objects:', objects.length, objects.map(o => o.name));
    
    // Apply selected-only filter FIRST
    if (showSelectedOnly && selectedObjects.length > 0) {
      console.log('Applying selected-only filter');
      const selectedIds = new Set(selectedObjects.map(obj => obj.id));
      
      const filterSelectedObjects = (sceneObjs: SceneObject[]): SceneObject[] => {
        return sceneObjs.filter(obj => {
          // Check if this object is selected
          if (selectedIds.has(obj.id)) {
            console.log('Object is selected:', obj.name);
            return true;
          }
          
          // Check if any children are selected (recursive)
          const hasSelectedChildren = (children: SceneObject[]): boolean => {
            return children.some(child => {
              if (selectedIds.has(child.id)) {
                return true;
              }
              return hasSelectedChildren(child.children);
            });
          };
          
          const result = hasSelectedChildren(obj.children);
          if (result) {
            console.log('Object has selected children:', obj.name);
          }
          return result;
        }).map(obj => ({
          ...obj,
          // Recursively filter children too
          children: filterSelectedObjects(obj.children)
        }));
      };
      
      objects = filterSelectedObjects(objects);
      console.log('Filtered objects:', objects.length);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      console.log('Applying search filter:', searchQuery);
      const filterBySearch = (sceneObjs: SceneObject[]): SceneObject[] => {
        return sceneObjs.filter(obj => 
          obj.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      };
      objects = filterBySearch(objects);
      console.log('Search filtered objects:', objects.length);
    }
    
    setSceneObjects(objects);
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly, forceUpdate]);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleVisibility = useCallback((sceneObject: SceneObject) => {
    console.log('Toggling visibility for:', sceneObject.name, 'current:', sceneObject.object.visible);
    
    const newVisibility = !sceneObject.object.visible;
    const targetObject = sceneObject.object;
    
    // Simple visibility toggle without material manipulation
    const updateObjectVisibility = (object: THREE.Object3D, visible: boolean) => {
      object.visible = visible;
      // Recursively update children
      object.children.forEach(child => updateObjectVisibility(child, visible));
    };
    
    // Apply visibility changes
    updateObjectVisibility(targetObject, newVisibility);
    
    // Update the sceneObject's visibility property
    sceneObject.visible = newVisibility;
    
    // Force re-render
    triggerUpdate();
    
    console.log('Visibility toggled to:', newVisibility, 'for object:', sceneObject.name);
  }, [triggerUpdate]);

  const handleObjectSelect = (sceneObject: SceneObject, isMultiSelect?: boolean) => {
    console.log('Selecting object:', sceneObject.name, 'multi:', isMultiSelect);
    if (isMultiSelect) {
      toggleSelection(sceneObject);
    } else {
      selectObject(sceneObject);
    }
  };

  const handleDelete = (sceneObject: SceneObject, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Deleting object:', sceneObject.name, sceneObject.type);
    
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
      triggerUpdate();
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
    clearSelection,
    triggerUpdate
  };
};
