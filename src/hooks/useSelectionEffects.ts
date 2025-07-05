
import { useEffect, useRef } from 'react';
import type { SceneObject } from '../types/model';
import { SelectionMaterials } from './utils/selectionMaterials';
import { usePointSelection } from './selection/usePointSelection';
import { useMeasurementSelection } from './selection/useMeasurementSelection';
import { useMeshSelection } from './selection/useMeshSelection';

export const useSelectionEffects = (selectedObject: SceneObject | null) => {
  const { applyPointSelection } = usePointSelection();
  const { applyMeasurementSelection } = useMeasurementSelection();
  const { applyMeshSelection } = useMeshSelection();
  const selectionMaterialsRef = useRef<SelectionMaterials>(new SelectionMaterials());
  const previousSelectedObjectRef = useRef<SceneObject | null>(null);

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean, objectType?: string) => {
    const overlayMaterial = selectionMaterialsRef.current.getOverlayMaterial();

    console.log('Applying selection effects:', { objectId: object.uuid, selected, objectType });

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

    // Handle meshes and primitives
    applyMeshSelection(object, selected, overlayMaterial);
  };

  // Apply/remove selection effects when selectedObject changes
  useEffect(() => {
    const previousSelected = previousSelectedObjectRef.current;
    
    // Remove effects from previously selected object
    if (previousSelected?.object && previousSelected !== selectedObject) {
      console.log('Removing selection from previous object:', previousSelected.id);
      applySelectionEffects(previousSelected.object, false, previousSelected.type);
    }

    // Apply effects to newly selected object
    if (selectedObject?.object) {
      console.log('Applying selection to new object:', selectedObject.id);
      applySelectionEffects(selectedObject.object, true, selectedObject.type);
    }

    // Update reference
    previousSelectedObjectRef.current = selectedObject;
  }, [selectedObject]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousSelectedObjectRef.current?.object) {
        applySelectionEffects(previousSelectedObjectRef.current.object, false, previousSelectedObjectRef.current.type);
      }
      selectionMaterialsRef.current.dispose();
    };
  }, []);
};
