
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  const { selectedObjects, selectObject, toggleSelection, clearSelection } = useSelectionContext();
  const previousSceneObjectsRef = useRef<SceneObject[]>([]);

  // Memoize scene objects with better dependency tracking
  const sceneObjects = useMemo(() => {
    if (!scene) return [];
    
    let objects = buildSceneObjects(scene, loadedModels, showPrimitives, selectedObjects);
    
    // Apply selected-only filter FIRST
    if (showSelectedOnly) {
      const selectedIds = new Set(selectedObjects.map(obj => obj.id));
      objects = objects.filter(obj => {
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
    
    // Only update if objects actually changed
    const hasChanged = JSON.stringify(objects.map(o => ({ id: o.id, name: o.name, visible: o.object?.visible }))) !== 
                      JSON.stringify(previousSceneObjectsRef.current.map(o => ({ id: o.id, name: o.name, visible: o.object?.visible })));
    
    if (hasChanged) {
      previousSceneObjectsRef.current = objects;
    }
    
    return objects;
  }, [scene, loadedModels, showPrimitives, selectedObjects, searchQuery, showSelectedOnly]);

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });
  }, []);

  const toggleVisibility = useCallback((sceneObject: SceneObject) => {
    if (!sceneObject.object || !scene) return;
    
    // Toggle visibility directly on the object
    const newVisibility = !sceneObject.object.visible;
    sceneObject.object.visible = newVisibility;
    
    // Recursively update all children visibility
    sceneObject.object.traverse((child) => {
      child.visible = newVisibility;
    });
    
    // Force scene update by triggering a render
    scene.dispatchEvent({ type: 'childadded' });
    
    // Update materials to force re-render
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.needsUpdate = true);
        } else {
          obj.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  const handleObjectSelect = useCallback((sceneObject: SceneObject, isMultiSelect?: boolean) => {
    if (isMultiSelect) {
      toggleSelection(sceneObject);
    } else {
      selectObject(sceneObject);
    }
  }, [selectObject, toggleSelection]);

  const handleDelete = useCallback((sceneObject: SceneObject, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!scene || !sceneObject.object) return;
    
    if (sceneObject.type === 'point' || sceneObject.type === 'measurement') {
      // Remove from scene
      scene.remove(sceneObject.object);
      
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
      
      // Trigger scene update
      scene.dispatchEvent({ type: 'childremoved' });
    }
  }, [scene]);

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
