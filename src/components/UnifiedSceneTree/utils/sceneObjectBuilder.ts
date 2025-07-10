
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
  } else if (object.userData?.isLoadedModel) {
    return `model_${baseId}`;
  } else if (object instanceof THREE.Group) {
    return `group_${baseId}`;
  } else if (object instanceof THREE.Mesh) {
    return `mesh_${baseId}`;
  }
  return `object_${baseId}`;
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
  console.log('buildSceneObjects: Loaded models count:', loadedModels.length);
  console.log('buildSceneObjects: Children details:', scene.children.map(child => ({
    name: child.name || 'unnamed',
    type: child.type,
    visible: child.visible,
    isPrimitive: child.userData?.isPrimitive,
    isHelper: child.userData?.isHelper,
    isLoadedModel: child.userData?.isLoadedModel,
    isFromLoadedModel: child.userData?.isFromLoadedModel
  })));
  
  const sceneObjects: SceneObject[] = [];
  const selectedIds = new Set(selectedObjects.map(obj => obj.id));

  // Helper function to determine if object should be included
  const shouldIncludeObject = (object: THREE.Object3D): boolean => {
    // Skip objects marked as helpers (but not our environment helpers)
    if (object.userData?.isHelper && object.type !== 'GridHelper' && object.type !== 'AxesHelper') {
      console.log('Skipping helper object:', object.name);
      return false;
    }
    
    // Skip internal Three.js objects
    if (object.name?.startsWith('__')) {
      console.log('Skipping internal object:', object.name);
      return false;
    }
    
    // Skip primitives if disabled
    if (object.userData?.isPrimitive && !showPrimitives) {
      console.log('Skipping primitive object (primitives disabled):', object.name);
      return false;
    }
    
    // Always include environment helpers (grid, axes)
    if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
      console.log('Including environment object:', object.name, object.type);
      return true;
    }
    
    // Always include loaded models and their children
    if (object.userData?.isLoadedModel || object.userData?.isFromLoadedModel) {
      console.log('Including loaded model object:', object.name, object.type);
      return true;
    }
    
    // Include all other objects (meshes, groups, lights, etc.)
    console.log('Including object:', object.name, object.type);
    return true;
  };

  // Enhanced function to determine object type with better loaded model detection
  const getObjectType = (object: THREE.Object3D): SceneObject['type'] => {
    // Check userData first for special types
    if (object.userData?.isPoint) return 'point';
    if (object.userData?.isMeasurementGroup) return 'measurement';
    
    // Check if this is a top-level loaded model
    if (object.userData?.isLoadedModel) {
      console.log('Detected top-level loaded model:', object.name);
      return 'model';
    }
    
    // Check if this object is part of a loaded model
    if (object.userData?.isFromLoadedModel) {
      // For objects within loaded models, categorize by Three.js type
      if (object instanceof THREE.Mesh) {
        console.log('Detected mesh from loaded model:', object.name);
        return 'mesh';
      }
      if (object instanceof THREE.Group) {
        console.log('Detected group from loaded model:', object.name);
        return 'group';
      }
    }
    
    // Check if this is a loaded model (fallback check)
    const isLoadedModel = loadedModels.some(model => model.object === object);
    if (isLoadedModel) {
      console.log('Detected loaded model via array check:', object.name);
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
  const createSceneObject = (object: THREE.Object3D, parentType?: string): SceneObject | null => {
    if (!shouldIncludeObject(object)) {
      return null;
    }

    const objectId = generateObjectId(object);
    const objectType = getObjectType(object);
    
    // Generate a meaningful name
    let objectName = object.name;
    if (!objectName || objectName.trim() === '') {
      if (objectType === 'environment') {
        objectName = object.type === 'GridHelper' ? 'Grid' : 'Axes';
      } else if (objectType === 'model') {
        objectName = object.userData?.modelName || `Model_${object.uuid.slice(0, 8)}`;
      } else {
        objectName = `${object.type}_${object.uuid.slice(0, 8)}`;
      }
    }

    console.log('Creating scene object:', { 
      name: objectName, 
      type: objectType, 
      id: objectId,
      hasChildren: object.children.length > 0,
      isFromLoadedModel: object.userData?.isFromLoadedModel,
      parentType
    });

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
        const childSceneObject = createSceneObject(child, objectType);
        if (childSceneObject) {
          validChildren.push(childSceneObject);
        }
      }
      
      sceneObject.children = validChildren;
      console.log('Object', objectName, 'has', validChildren.length, 'valid children');
    }

    return sceneObject;
  };

  // Process all direct children of the scene
  for (const child of scene.children) {
    console.log('Processing scene child:', {
      name: child.name || 'unnamed',
      type: child.type,
      isPrimitive: child.userData?.isPrimitive,
      isHelper: child.userData?.isHelper,
      isLoadedModel: child.userData?.isLoadedModel,
      isFromLoadedModel: child.userData?.isFromLoadedModel
    });
    
    const sceneObject = createSceneObject(child);
    if (sceneObject) {
      sceneObjects.push(sceneObject);
      console.log('Added to scene tree:', sceneObject.name, sceneObject.type);
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
    geometry: [] as SceneObject[], // Unified geometry category
    points: [] as SceneObject[],
    measurements: [] as SceneObject[],
    lights: [] as SceneObject[],
    environment: [] as SceneObject[]
  };

  const categorizeObject = (obj: SceneObject) => {
    switch (obj.type) {
      case 'model':
      case 'mesh':
      case 'group':
        groups.geometry.push(obj); // All geometry types go into unified category
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
