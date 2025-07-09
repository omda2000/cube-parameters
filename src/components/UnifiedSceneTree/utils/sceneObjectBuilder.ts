
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

// Helper function to generate consistent object IDs
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
  if (!scene) {
    console.log('buildSceneObjects: No scene provided');
    return [];
  }

  console.log('buildSceneObjects: Starting build with scene children:', scene.children.length);
  console.log('buildSceneObjects: Scene children types:', scene.children.map(child => ({ name: child.name, type: child.type, isPrimitive: child.userData.isPrimitive })));
  
  const sceneObjects: SceneObject[] = [];
  const selectedIds = new Set(selectedObjects.map(obj => obj.id));

  // Helper function to determine if object should be included
  const shouldIncludeObject = (object: THREE.Object3D): boolean => {
    // Skip internal helpers but log them
    if (object.userData.isHelper) {
      console.log('Skipping helper object:', object.name, object.type);
      return false;
    }
    if (object.name && object.name.startsWith('__')) {
      console.log('Skipping internal object:', object.name);
      return false;
    }
    
    // Always include primitives if showPrimitives is true, skip if false
    if (object.userData.isPrimitive) {
      console.log('Found primitive object:', object.name, 'showPrimitives:', showPrimitives);
      return showPrimitives;
    }
    
    // Include all other objects
    console.log('Including object:', object.name, object.type);
    return true;
  };

  // Helper function to determine object type
  const getObjectType = (object: THREE.Object3D): SceneObject['type'] => {
    if (object.userData.isPrimitive) return 'primitive';
    if (object.userData.isPoint) return 'point';
    if (object.userData.isMeasurementGroup) return 'measurement';
    if (object instanceof THREE.Light) return 'light';
    if (object.type === 'GridHelper' || object.type === 'AxesHelper') return 'environment';
    
    // Check if this is a loaded model
    const isLoadedModel = loadedModels.some(model => model.object === object);
    if (isLoadedModel) return 'model';
    
    if (object instanceof THREE.Group) return 'group';
    if (object instanceof THREE.Mesh) return 'mesh';
    
    return 'mesh'; // Default fallback
  };

  // Recursive function to create SceneObject
  const createSceneObject = (object: THREE.Object3D): SceneObject | null => {
    if (!shouldIncludeObject(object)) {
      return null;
    }

    const objectId = generateObjectId(object);
    const objectType = getObjectType(object);

    console.log('Creating scene object:', { 
      name: object.name, 
      type: objectType, 
      id: objectId,
      isPrimitive: object.userData.isPrimitive 
    });

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
      const validChildren: SceneObject[] = [];
      
      for (const child of object.children) {
        const childSceneObject = createSceneObject(child);
        if (childSceneObject) {
          validChildren.push(childSceneObject);
        }
      }
      
      sceneObject.children = validChildren;
      console.log('Object has children:', sceneObject.name, 'children count:', validChildren.length);
    }

    return sceneObject;
  };

  // Process all scene children
  for (const child of scene.children) {
    console.log('Processing scene child:', child.name, child.type, child.userData);
    const sceneObject = createSceneObject(child);
    if (sceneObject) {
      sceneObjects.push(sceneObject);
      console.log('Added scene object:', sceneObject.name, sceneObject.type);
    }
  }

  console.log('buildSceneObjects: Built', sceneObjects.length, 'top-level objects');
  console.log('buildSceneObjects: Final objects:', sceneObjects.map(obj => ({ name: obj.name, type: obj.type })));
  
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
