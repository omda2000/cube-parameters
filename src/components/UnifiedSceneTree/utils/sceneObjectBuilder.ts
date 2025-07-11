
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
  const processedObjects = new Set<THREE.Object3D>(); // Track processed objects to avoid duplication

  // Create a map of loaded model objects for quick lookup
  const loadedModelMap = new Map<THREE.Object3D, LoadedModel>();
  loadedModels.forEach(model => {
    loadedModelMap.set(model.object, model);
    // Also mark all children of loaded models to prevent separate processing
    model.object.traverse(child => {
      if (child !== model.object) {
        child.userData.isPartOfLoadedModel = true;
        child.userData.loadedModelRoot = model.object;
      }
    });
  });

  // Helper function to determine object type and create SceneObject
  const createSceneObject = (object: THREE.Object3D, parentId?: string): SceneObject => {
    let objectType: SceneObject['type'] = 'mesh';
    const objectId = generateObjectId(object);

    // Check if this is a loaded model root
    const loadedModel = loadedModelMap.get(object);
    if (loadedModel) {
      objectType = 'model';
    } else if (object.userData.isPrimitive) {
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

    const sceneObject: SceneObject = {
      id: objectId,
      name: loadedModel ? loadedModel.name : (object.name || `${object.type}_${object.uuid.slice(0, 8)}`),
      type: objectType,
      object: object,
      children: [],
      visible: object.visible,
      selected: selectedIds.has(objectId)
    };

    // Build children recursively, but only for loaded models or non-model objects
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
    // Skip if this object has already been processed or is a helper
    if (processedObjects.has(child) || child.userData.isHelper) {
      return;
    }

    // If this is a loaded model, process it as a single unit
    const loadedModel = loadedModelMap.get(child);
    if (loadedModel) {
      const sceneObject = createSceneObject(child);
      sceneObjects.push(sceneObject);
      
      // Mark this model and all its children as processed to prevent duplication
      processedObjects.add(child);
      child.traverse(descendant => {
        processedObjects.add(descendant);
      });
    } else if (!child.userData.isPartOfLoadedModel) {
      // Only process objects that are not part of a loaded model
      const sceneObject = createSceneObject(child);
      sceneObjects.push(sceneObject);
      processedObjects.add(child);
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

  const categorizeObject = (obj: SceneObject, isTopLevel = true) => {
    // Only categorize top-level objects to avoid duplication
    if (isTopLevel) {
      switch (obj.type) {
        case 'model':
          groups.models.push(obj);
          break;
        case 'mesh':
          // Only add meshes that are not part of loaded models
          if (!obj.object.userData.isPartOfLoadedModel) {
            groups.meshes.push(obj);
          }
          break;
        case 'group':
          // Only add groups that are not loaded models
          const isLoadedModel = obj.type === 'model';
          if (!isLoadedModel && !obj.object.userData.isPartOfLoadedModel) {
            groups.groups.push(obj);
          }
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
    }

    // Don't recursively categorize children - they should be shown as part of their parent
  };

  sceneObjects.forEach(obj => categorizeObject(obj, true));

  return groups;
};
