
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

// Helper function to generate consistent object IDs (same as in useObjectSelection)
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

// Helper to get display name for objects
const getObjectDisplayName = (object: THREE.Object3D, loadedModel?: LoadedModel): string => {
  // Prefer loaded model name first
  if (loadedModel) {
    return loadedModel.name;
  }
  
  // Then prefer user data id over object name
  if (object.userData?.id) {
    return object.userData.id;
  }
  
  if (object.name) {
    return object.name;
  }
  
  // Fallback to type-based naming
  const type = object.userData?.type || object.type;
  return `${type}_${object.uuid.slice(0, 8)}`;
};

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[] = []
): SceneObject[] => {
  if (!scene) {
    console.log('No scene provided to buildSceneObjects');
    return [];
  }

  console.log('Building scene objects with:', {
    sceneChildren: scene.children.length,
    loadedModels: loadedModels.length,
    showPrimitives
  });

  const sceneObjects: SceneObject[] = [];
  const selectedIds = new Set(selectedObjects.map(obj => obj.id));
  const processedObjects = new Set<THREE.Object3D>(); // Track processed objects to avoid duplication

  // Create a map of loaded model objects for quick lookup
  const loadedModelMap = new Map<THREE.Object3D, LoadedModel>();
  loadedModels.forEach(model => {
    loadedModelMap.set(model.object, model);
    // Mark the loaded model root
    model.object.userData.isLoadedModel = true;
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
    if (loadedModel || object.userData.isLoadedModel) {
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
      name: getObjectDisplayName(object, loadedModel),
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
  scene.children.forEach((child, index) => {
    console.log(`Processing scene child ${index}:`, {
      name: child.name,
      type: child.type,
      isLoadedModel: child.userData?.isLoadedModel,
      isHelper: child.userData?.isHelper,
      hasChildren: child.children.length > 0
    });
    
    // Skip if this object has already been processed or is a helper
    if (processedObjects.has(child) || child.userData.isHelper) {
      console.log('Skipping child (already processed or helper)');
      return;
    }

    // If this is a loaded model container, extract individual meshes instead of showing the container
    const loadedModel = loadedModelMap.get(child);
    if (loadedModel || child.userData.isLoadedModel) {
      console.log('Processing loaded model container, extracting individual models:', child.name);
      
      // Instead of adding the container, add each detached mesh as individual objects
      if (child.userData.detachedMeshes) {
        child.userData.detachedMeshes.forEach((mesh: THREE.Mesh) => {
          if (!processedObjects.has(mesh)) {
            console.log('Adding individual model from GLB:', mesh.userData?.name || mesh.name);
            const sceneObject = createSceneObject(mesh);
            sceneObjects.push(sceneObject);
            processedObjects.add(mesh);
          }
        });
      }
      
      // Mark container as processed to avoid duplication
      processedObjects.add(child);
      child.traverse(descendant => {
        processedObjects.add(descendant);
      });
    } else {
      // Check if this is a detached GLB mesh that should be shown as individual object
      const isDetachedGLBMesh = child.userData?.isDetachedFromGLB === true;
      
      if (isDetachedGLBMesh) {
        console.log('Processing detached GLB mesh as individual object:', child.name || child.type);
        const sceneObject = createSceneObject(child);
        sceneObjects.push(sceneObject);
        console.log('Added detached GLB mesh to scene objects:', sceneObject.name);
        processedObjects.add(child);
      } else if (!child.userData.isPartOfLoadedModel) {
        // Only process objects that are not part of a loaded model
        console.log('Processing as standalone object:', child.name);
        const sceneObject = createSceneObject(child);
        sceneObjects.push(sceneObject);
        console.log('Added standalone object to scene objects:', sceneObject.name);
        processedObjects.add(child);
      } else {
        console.log('Skipping object (part of loaded model):', child.name || child.type);
      }
    }
  });

  console.log('Built scene objects final result:', sceneObjects.length);
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
          // Only add groups that are not loaded models and not part of loaded models
          if (!obj.object.userData.isLoadedModel && !obj.object.userData.isPartOfLoadedModel) {
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
