
import { useEffect } from 'react';
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

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean, objectType?: string) => {
    console.log(`Applying selection effects: ${selected} for object type: ${objectType}`);
    
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

    // Handle meshes
    applyMeshSelection(object, selected);
  };

  // Apply selection effects when selectedObjects changes
  useEffect(() => {
    console.log('Selection effects: applying to', selectedObjects.length, 'objects');
    
    selectedObjects.forEach(selectedObject => {
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, true, selectedObject.type);
      }
    });
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
