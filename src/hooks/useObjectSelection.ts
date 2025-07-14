
import { useMemo } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';
import { useSelectionContext } from '../contexts/SelectionContext';

// Helper function to generate consistent object IDs
const generateObjectId = (object: THREE.Object3D): string => {
  // Use userData.id if available from GLB files
  if (object.userData?.id) {
    return `gltf_${object.userData.id}`;
  }
  
  if (object.userData.isPrimitive) {
    return `primitive_${object.uuid}`;
  } else if (object.userData.isPoint) {
    return `point_${object.uuid}`;
  } else if (object.userData.isMeasurementGroup) {
    return `measurement_${object.uuid}`;
  } else if (object.userData.isLoadedModel || object instanceof THREE.Group) {
    return `group_${object.uuid}`;
  } else if (object instanceof THREE.Mesh) {
    return `mesh_${object.uuid}`;
  } else if (object instanceof THREE.Light) {
    return `light_${object.uuid}`;
  } else if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
    return `env_${object.uuid}`;
  }
  return `object_${object.uuid}`;
};

// Helper function to determine object type
const getObjectType = (object: THREE.Object3D): SceneObject['type'] => {
  if (object.userData.isLoadedModel) {
    return 'model';
  } else if (object.userData.isPrimitive) {
    return 'primitive';
  } else if (object.userData.isPoint) {
    return 'point';
  } else if (object.userData.isMeasurementGroup) {
    return 'measurement';
  } else if (object instanceof THREE.Group) {
    return 'group';
  } else if (object instanceof THREE.Mesh) {
    return 'mesh';
  } else if (object instanceof THREE.Light) {
    return 'light';
  } else if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
    return 'environment';
  }
  return 'mesh';
};

export const useObjectSelection = () => {
  const { selectObject, selectedObjects, clearSelection, toggleSelection } = useSelectionContext();

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null, isMultiSelect = false) => {
    if (object) {
      const objectId = generateObjectId(object);
      const objectType = getObjectType(object);
      
      // Extract display name using the same logic as scene builder
      let displayName = '';
      if (object.userData?.name) {
        displayName = object.userData.name;
      } else if (object.userData?.id) {
        displayName = object.userData.id;
      } else if (object.name) {
        displayName = object.name;
      } else {
        const type = object.userData?.type || object.type;
        displayName = `${type}_${object.uuid.slice(0, 8)}`;
      }
      
      const sceneObject: SceneObject = {
        id: objectId,
        name: displayName,
        type: objectType,
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      
      console.log('Selecting object:', sceneObject.name, 'Type:', sceneObject.type, 'Multi:', isMultiSelect);
      
      if (isMultiSelect) {
        toggleSelection(sceneObject);
      } else {
        selectObject(sceneObject);
      }
    } else if (!isMultiSelect) {
      console.log('Clearing selection');
      clearSelection();
    }
  }, [selectObject, clearSelection, toggleSelection]);

  return {
    selectedObjects,
    clearSelection,
    handleObjectSelect
  };
};
