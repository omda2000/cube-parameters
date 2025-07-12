
import { useEffect } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { usePointSelection } from './selection/usePointSelection';
import { useMeasurementSelection } from './selection/useMeasurementSelection';
import { useMeshSelection } from './selection/useMeshSelection';

export const useSelectionEffects = (selectedObjects: SceneObject[]) => {
  const { applyPointSelection } = usePointSelection();
  const { applyMeasurementSelection } = useMeasurementSelection();
  const { applyMeshSelection } = useMeshSelection();

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean, objectType?: string) => {
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

    // Handle meshes - only use outline and bounding box, no material overlay
    applyMeshSelection(object, selected);
  };

  // Apply/remove selection effects when selectedObjects changes
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      selectedObjects.forEach(selectedObject => {
        if (selectedObject?.object) {
          applySelectionEffects(selectedObject.object, false, selectedObject.type);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Apply selection effects to all selected objects
    selectedObjects.forEach(selectedObject => {
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, true, selectedObject.type);
      }
    });

    return () => {
      // Remove selection effects from all selected objects
      selectedObjects.forEach(selectedObject => {
        if (selectedObject?.object) {
          applySelectionEffects(selectedObject.object, false, selectedObject.type);
        }
      });
    };
  }, [selectedObjects]);
};
