
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

// Helper function to generate consistent object IDs (same as in useObjectSelection)
const generateObjectId = (object: THREE.Object3D): string => {
  if (object.userData.isPrimitive) {
    return `primitive_${object.uuid}`;
  } else if (object.userData.isPoint) {
    return `point_${object.uuid}`;
  } else if (object.userData.isMeasurementGroup) {
    return `measurement_${object.uuid}`;
  } else if (object instanceof THREE.Group) {
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

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[] = []
): SceneObject[] => {
  if (!scene) return [];

  const sceneObjects: SceneObject[] = [];
  const selectedIds = new Set(selectedObjects.map(obj => obj.id));

  // Helper function to determine object type and create SceneObject
  const createSceneObject = (object: THREE.Object3D, parentId?: string): SceneObject => {
    let objectType: SceneObject['type'] = 'mesh';
    const objectId = generateObjectId(object);

    // Determine object type based on userData and object properties
    if (object.userData.isPrimitive) {
      objectType = 'primitive';
    } else if (object.userData.isPoint) {
      objectType = 'point';
    } else if (object.userData.isMeasurementGroup) {
      objectType = 'measurement';
    } else if (object instanceof THREE.Group) {
      objectType = 'group';
    } else if (object instanceof THREE.Mesh) {
      objectType = 'mesh';
    } else if (object instanceof THREE.Light) {
      objectType = 'light';
    } else if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
      objectType = 'environment';
    }

    // Check if this is a loaded model
    const isLoadedModel = loadedModels.some(model => model.object === object);
    if (isLoadedModel) {
      objectType = 'model';
    }

    const sceneObject: SceneObject = {
      id: objectId,
      name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
      type: objectType,
      object: object,
      children: [],
      visible: object.visible,
      selected: selectedIds.has(objectId)
    };

    // Build children recursively
    if (object.children.length > 0) {
      sceneObject.children = object.children
        .map(child => createSceneObject(child, objectId))
        .filter(child => {
          // Filter logic based on showPrimitives and other criteria
          if (!showPrimitives && child.type === 'primitive') return false;
          if (child.object.userData.isHelper) return false;
          return true;
        });
    }

    return sceneObject;
  };

  // Traverse the scene and build the tree
  scene.children.forEach(child => {
    const sceneObject = createSceneObject(child);
    
    // Only add objects that should be visible in the tree
    if (!child.userData.isHelper) {
      sceneObjects.push(sceneObject);
    }
  });

  return sceneObjects;
};

export const groupSceneObjects = (sceneObjects: SceneObject[]) => {
  const groups = {
    models: [] as SceneObject[],
    meshes: [] as SceneObject[],
    groups: [] as SceneObject[],
    primitives: [] as SceneObject[],
    points: [] as SceneObject[],
    measurements: [] as SceneObject[],
    lights: [] as SceneObject[],
    environment: [] as SceneObject[]
  };

  const categorizeObject = (obj: SceneObject) => {
    switch (obj.type) {
      case 'model':
        groups.models.push(obj);
        break;
      case 'mesh':
        groups.meshes.push(obj);
        break;
      case 'group':
        groups.groups.push(obj);
        break;
      case 'primitive':
        groups.primitives.push(obj);
        break;
      case 'point':
        groups.points.push(obj);
        break;
      case 'measurement':
        groups.measurements.push(obj);
        break;
      case 'light':
        groups.lights.push(obj);
        break;
      case 'environment':
        groups.environment.push(obj);
        break;
    }

    // Recursively categorize children
    obj.children.forEach(categorizeObject);
  };

  sceneObjects.forEach(categorizeObject);

  return groups;
};
