
import { useEffect } from 'react';
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
    const overlayMaterial = selectionMaterials.getOverlayMaterial();

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
    applyMeshSelection(object, selected, overlayMaterial);
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
      selectionMaterials.dispose();
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
