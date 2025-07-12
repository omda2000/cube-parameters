import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { SelectionMaterials } from './utils/selectionMaterials';
import { usePointSelection } from './selection/usePointSelection';
import { useMeasurementSelection } from './selection/useMeasurementSelection';
import { useMeshSelection } from './selection/useMeshSelection';

export const useSelectionEffects = (selectedObjects: SceneObject[]) => {
  const { applyPointSelection } = usePointSelection();
  const { applyMeasurementSelection } = useMeasurementSelection();
  const { applyMeshSelection } = useMeshSelection();
  const selectionMaterialsRef = useRef<SelectionMaterials | null>(null);
  const previousSelectedRef = useRef<SceneObject[]>([]);

  // Initialize selection materials
  if (!selectionMaterialsRef.current) {
    selectionMaterialsRef.current = new SelectionMaterials();
  }

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean, objectType?: string) => {
    console.log(`Applying selection effects: ${selected ? 'SELECT' : 'DESELECT'} for object type: ${objectType}, object:`, object.name || object.type);
    
    // Handle points
    if (objectType === 'point') {
      applyPointSelection(object, selected);
      return;
    }

    // Handle measurements (groups)
    if (objectType === 'measurement') {
      applyMeasurementSelection(object, selected);
      return;
    }

    // Handle meshes and groups
    applyMeshSelection(object, selected);
  };

  // Handle selection changes with better state management
  useEffect(() => {
    console.log('Selection effects: selectedObjects changed', selectedObjects.length, 'objects');
    const previousSelected = previousSelectedRef.current;

    // Remove effects from previously selected objects that are no longer selected
    previousSelected.forEach(prevObject => {
      const stillSelected = selectedObjects.some(obj => obj.id === prevObject.id);
      if (!stillSelected && prevObject?.object) {
        console.log('Removing selection effects from deselected object:', prevObject.name);
        applySelectionEffects(prevObject.object, false, prevObject.type);
      }
    });

    // Apply effects to newly selected objects
    selectedObjects.forEach(selectedObject => {
      if (selectedObject?.object) {
        const wasSelected = previousSelected.some(obj => obj.id === selectedObject.id);
        if (!wasSelected) {
          console.log('Applying selection effects to newly selected object:', selectedObject.name);
          applySelectionEffects(selectedObject.object, true, selectedObject.type);
        }
      }
    });

    // Update reference for next comparison
    previousSelectedRef.current = [...selectedObjects];
  }, [selectedObjects]);

  // Return cleanup function for manual cleanup if needed
  return {
    cleanupSelection: () => {
      selectedObjects.forEach(selectedObject => {
        if (selectedObject?.object) {
          applySelectionEffects(selectedObject.object, false, selectedObject.type);
        }
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Selection effects: cleanup on unmount');
      if (selectionMaterialsRef.current) {
        selectionMaterialsRef.current.dispose();
        selectionMaterialsRef.current = null;
      }
    };
  }, []);
};