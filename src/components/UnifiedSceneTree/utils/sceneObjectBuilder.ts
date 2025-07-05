import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[]
): SceneObject[] => {
  if (!scene) return [];

  const objects: SceneObject[] = [];
  const processedObjects = new Set<string>();
  const selectedIds = new Set(selectedObjects.map(obj => obj.id));

  // Add loaded models first
  loadedModels.forEach(model => {
    const modelObject: SceneObject = {
      id: `model_${model.id}`,
      name: model.name,
      type: 'group',
      object: model.object,
      children: buildChildren(model.object, selectedIds),
      visible: model.object.visible,
      selected: selectedIds.has(`model_${model.id}`)
    };
    objects.push(modelObject);
    processedObjects.add(model.object.uuid);
  });

  // Traverse the entire scene to find all objects
  scene.traverse((object) => {
    // Skip if already processed or if it's the scene itself
    if (processedObjects.has(object.uuid) || object === scene) return;
    
    // Skip objects that are children of already processed objects
    let parent = object.parent;
    let isChildOfProcessed = false;
    while (parent && parent !== scene) {
      if (processedObjects.has(parent.uuid)) {
        isChildOfProcessed = true;
        break;
      }
      parent = parent.parent;
    }
    if (isChildOfProcessed) return;

    // Handle primitives
    if (object.userData.isPrimitive) {
      if (showPrimitives) {
        const primitiveId = `primitive_${object.uuid}`;
        const primitiveObject: SceneObject = {
          id: primitiveId,
          name: object.name || 'Box Primitive',
          type: 'primitive',
          object: object,
          children: [],
          visible: object.visible,
          selected: selectedIds.has(primitiveId)
        };
        objects.push(primitiveObject);
        processedObjects.add(object.uuid);
      }
      return;
    }

    // Handle points
    if (object.userData.isPoint) {
      const pointId = `point_${object.uuid}`;
      const pointObject: SceneObject = {
        id: pointId,
        name: object.name || `Point (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`,
        type: 'point',
        object: object,
        children: [],
        visible: object.visible,
        selected: selectedIds.has(pointId)
      };
      objects.push(pointObject);
      processedObjects.add(object.uuid);
      return;
    }

    // Handle measurement groups
    if (object.userData.isMeasurementGroup && object instanceof THREE.Group) {
      const measurementData = object.userData.measurementData;
      const distance = measurementData ? measurementData.distance : 0;
      const measurementId = `measurement_${object.uuid}`;
      
      const measurementObject: SceneObject = {
        id: measurementId,
        name: `Measurement (${distance.toFixed(3)} units)`,
        type: 'measurement',
        object: object,
        children: [],
        visible: object.visible,
        selected: selectedIds.has(measurementId),
        measurementData: measurementData ? {
          startPoint: measurementData.startPoint,
          endPoint: measurementData.endPoint,
          distance: measurementData.distance
        } : undefined
      };
      objects.push(measurementObject);
      processedObjects.add(object.uuid);
      return;
    }

    // Handle ground plane
    if (object instanceof THREE.Mesh && 
        object.geometry instanceof THREE.PlaneGeometry && 
        object.userData.isHelper) {
      const groundObject: SceneObject = {
        id: 'ground',
        name: 'Ground Plane',
        type: 'ground',
        object: object,
        children: [],
        visible: object.visible,
        selected: selectedIds.has('ground')
      };
      objects.push(groundObject);
      processedObjects.add(object.uuid);
      return;
    }

    // Handle all other objects (including meshes, groups, etc.)
    if (object.parent === scene && !object.userData.isHelper) {
      let objectType: SceneObject['type'] = 'mesh';
      let objectName = object.name;
      const objectId = `object_${object.uuid}`;

      if (object instanceof THREE.Group) {
        objectType = 'group';
        objectName = objectName || `Group_${object.uuid.slice(0, 8)}`;
      } else if (object instanceof THREE.Mesh) {
        objectType = 'mesh';
        objectName = objectName || `Mesh_${object.uuid.slice(0, 8)}`;
      } else if (object instanceof THREE.Light) {
        objectType = 'light';
        objectName = objectName || `${object.type}_${object.uuid.slice(0, 8)}`;
      } else {
        objectName = objectName || `${object.type}_${object.uuid.slice(0, 8)}`;
      }

      const sceneObject: SceneObject = {
        id: objectId,
        name: objectName,
        type: objectType,
        object: object,
        children: buildChildren(object, selectedIds),
        visible: object.visible,
        selected: selectedIds.has(objectId)
      };
      objects.push(sceneObject);
      processedObjects.add(object.uuid);
    }
  });

  return objects;
};

const buildChildren = (object: THREE.Object3D, selectedIds: Set<string>): SceneObject[] => {
  return object.children
    .filter(child => !child.userData.isHelper)
    .map(child => {
      const childId = `child_${child.uuid}`;
      return {
        id: childId,
        name: child.name || `${child.type}_${child.uuid.slice(0, 8)}`,
        type: child instanceof THREE.Mesh ? 'mesh' : 
              child instanceof THREE.Group ? 'group' : 
              child instanceof THREE.Light ? 'light' : 'mesh',
        object: child,
        children: buildChildren(child, selectedIds),
        visible: child.visible,
        selected: selectedIds.has(childId)
      };
    });
};

export const groupSceneObjects = (sceneObjects: SceneObject[]) => {
  return {
    models: sceneObjects.filter(obj => obj.type === 'group' && obj.id.startsWith('model_')),
    primitives: sceneObjects.filter(obj => obj.type === 'primitive'),
    points: sceneObjects.filter(obj => obj.type === 'point'),
    measurements: sceneObjects.filter(obj => obj.type === 'measurement'),
    meshes: sceneObjects.filter(obj => obj.type === 'mesh'),
    groups: sceneObjects.filter(obj => obj.type === 'group' && !obj.id.startsWith('model_')),
    lights: sceneObjects.filter(obj => obj.type === 'light'),
    environment: sceneObjects.filter(obj => obj.type === 'ground')
  };
};
