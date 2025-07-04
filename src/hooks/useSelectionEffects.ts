
import { useEffect } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { SelectionMaterials } from './utils/selectionMaterials';
import { usePointSelection } from './selection/usePointSelection';
import { useMeasurementSelection } from './selection/useMeasurementSelection';
import { useMeshSelection } from './selection/useMeshSelection';

export const useSelectionEffects = (selectedObject: SceneObject | null) => {
  const { applyPointSelection } = usePointSelection();
  const { applyMeasurementSelection } = useMeasurementSelection();
  const { applyMeshSelection } = useMeshSelection();
  const selectionMaterials = new SelectionMaterials();

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean, type?: string) => {
    const overlayMaterial = selectionMaterials.getOverlayMaterial();

    // Handle points
    if (type === 'point') {
      applyPointSelection(object, selected);
      return;
    }

    // Handle measurements (groups)
    if (type === 'measurement') {
      applyMeasurementSelection(object, selected);
      return;
    }

    // Handle meshes
    applyMeshSelection(object, selected, overlayMaterial);
  };

  // Apply/remove selection effects when selectedObject changes
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, false, selectedObject.type);
      }
      selectionMaterials.dispose();
    };
  }, []);

  useEffect(() => {
    if (selectedObject?.object) {
      applySelectionEffects(selectedObject.object, true, selectedObject.type);
    }

    return () => {
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, false, selectedObject.type);
      }
    };
  }, [selectedObject]);
};
