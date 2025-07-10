
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

// Helper function to generate consistent object IDs
const generateObjectId = (object: THREE.Object3D): string => {
  // Use a more stable ID generation approach
  const baseId = object.uuid.slice(0, 8);
  
  if (object.userData?.isPrimitive) {
    return `primitive_${baseId}`;
  } else if (object.userData?.isPoint) {
    return `point_${baseId}`;
  } else if (object.userData?.isMeasurementGroup) {
    return `measurement_${baseId}`;
  } else if (object instanceof THREE.Light) {
    return `light_${baseId}`;
  } else if (object.type === 'GridHelper') {
    return `grid_${baseId}`;
  } else if (object.type === 'AxesHelper') {
    return `axes_${baseId}`;
  } else if (object instanceof THREE.Group) {
    return `group_${baseId}`;
  } else if (object instanceof THREE.Mesh) {
    return `mesh_${baseId}`;
  }
  return `object_${baseId}`;
};

// Stable model identification using object references and userData
const createModelLookupMap = (loadedModels: LoadedModel[]) => {
  const map = new Map<THREE.Object3D, LoadedModel>();
  const modelIds = new Set<string>();
  
  loadedModels.forEach(model => {
    map.set(model.object, model);
    modelIds.add(model.object.uuid);
    
    // Mark the model object with stable userData
    model.object.userData.isLoadedModel = true;
    model.object.userData.modelId = model.id;
  });
  
  return { map, modelIds };
};

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[] = []
): SceneObject[] => {
  if (!scene) {
    console.log('buildSceneObjects: No scene provided');
    return [];
  }

  console.log('buildSceneObjects: Starting with scene children:', scene.children.length);
  
  const sceneObjects: SceneObject[] = [];
  const selectedIds = new Set(selectedObjects.map(obj => obj.id));
  
  // Create stable model lookup
  const { map: modelLookupMap, modelIds } = createModelLookupMap(loadedModels);

  // Helper function to determine if object should be included
  const shouldIncludeObject = (object: THREE.Object3D): boolean => {
    // Skip objects marked as helpers (but not our environment helpers)
    if (object.userData?.isHelper && object.type !== 'GridHelper' && object.type !== 'AxesHelper') {
      return false;
    }
    
    // Skip internal Three.js objects
    if (object.name?.startsWith('__')) {
      return false;
    }
    
    // Handle primitives based on showPrimitives flag
    if (object.userData?.isPrimitive) {
      return showPrimitives;
    }
    
    // Always include environment helpers (grid, axes)
    if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
      return true;
    }
    
    // Include all other objects (meshes, groups, lights, etc.)
    return true;
  };

  // Helper function to determine object type with stable classification
  const getObjectType = (object: THREE.Object3D): SceneObject['type'] => {
    // Check userData first for special types
    if (object.userData?.isPrimitive) return 'primitive';
    if (object.userData?.isPoint) return 'point';
    if (object.userData?.isMeasurementGroup) return 'measurement';
    
    // Stable model detection using multiple criteria
    if (object.userData?.isLoadedModel || 
        modelLookupMap.has(object) ||
        modelIds.has(object.uuid)) {
      return 'model';
    }
    
    // Check Three.js types
    if (object instanceof THREE.Light) return 'light';
    if (object.type === 'GridHelper' || object.type === 'AxesHelper') return 'environment';
    if (object instanceof THREE.Group) return 'group';
    if (object instanceof THREE.Mesh) return 'mesh';
    
    // Default fallback
    return 'mesh';
  };

  // Recursive function to create SceneObject hierarchy
  const createSceneObject = (object: THREE.Object3D): SceneObject | null => {
    if (!shouldIncludeObject(object)) {
      return null;
    }

    const objectId = generateObjectId(object);
    const objectType = getObjectType(object);
    
    // Generate a meaningful name
    let objectName = object.name;
    if (!objectName || objectName.trim() === '') {
      if (objectType === 'primitive') {
        objectName = 'Box';
      } else if (objectType === 'environment') {
        objectName = object.type === 'GridHelper' ? 'Grid' : 'Axes';
      } else if (objectType === 'model') {
        const model = modelLookupMap.get(object);
        objectName = model ? model.name : `Model_${object.uuid.slice(0, 8)}`;
      } else {
        objectName = `${object.type}_${object.uuid.slice(0, 8)}`;
      }
    }

    const sceneObject: SceneObject = {
      id: objectId,
      name: objectName,
      type: objectType,
      object: object,
      children: [],
      visible: object.visible,
      selected: selectedIds.has(objectId)
    };

    // Process children recursively
    if (object.children.length > 0) {
      const validChildren: SceneObject[] = [];
      
      for (const child of object.children) {
        const childSceneObject = createSceneObject(child);
        if (childSceneObject) {
          validChildren.push(childSceneObject);
        }
      }
      
      sceneObject.children = validChildren;
    }

    return sceneObject;
  };

  // Process all direct children of the scene
  for (const child of scene.children) {
    const sceneObject = createSceneObject(child);
    if (sceneObject) {
      sceneObjects.push(sceneObject);
    }
  }

  console.log('buildSceneObjects: Final result -', sceneObjects.length, 'top-level objects');
  console.log('buildSceneObjects: Objects summary:', sceneObjects.map(obj => ({ 
    name: obj.name, 
    type: obj.type,
    children: obj.children.length 
  })));
  
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
