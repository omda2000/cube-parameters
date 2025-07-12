
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
  const selectionMaterials = new SelectionMaterials();
  const previousSelectedRef = useRef<SceneObject[]>([]);

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

  // Handle selection changes
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
        console.log('Applying selection effects to object:', selectedObject.name);
        applySelectionEffects(selectedObject.object, true, selectedObject.type);
      }
    });

    // Update reference for next comparison
    previousSelectedRef.current = [...selectedObjects];
  }, [selectedObjects]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Selection effects: cleanup on unmount');
      selectedObjects.forEach(selectedObject => {
        if (selectedObject?.object) {
          applySelectionEffects(selectedObject.object, false, selectedObject.type);
        }
      });
      selectionMaterials.dispose();
    };
  }, []);
};
