
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObject: SceneObject | null
): SceneObject[] => {
  if (!scene) return [];

  const objects: SceneObject[] = [];

  // Add loaded models
  loadedModels.forEach(model => {
    const modelId = `model_${model.id}`;
    const modelObject: SceneObject = {
      id: modelId,
      name: model.name,
      type: 'group',
      object: model.object,
      children: buildChildren(model.object, selectedObject),
      visible: model.object.visible,
      selected: selectedObject?.id === modelId
    };
    objects.push(modelObject);
  });

  // Add primitives if showing
  if (showPrimitives) {
    scene.traverse((object) => {
      if (object.userData.isPrimitive) {
        const primitiveId = `primitive_${object.uuid}`;
        const primitiveObject: SceneObject = {
          id: primitiveId,
          name: object.name || 'Box Primitive',
          type: 'primitive',
          object: object,
          children: [],
          visible: object.visible,
          selected: selectedObject?.id === primitiveId
        };
        objects.push(primitiveObject);
      }
    });
  }

  // Add points
  scene.traverse((object) => {
    if (object.userData.isPoint) {
      const pointId = `point_${object.uuid}`;
      const pointObject: SceneObject = {
        id: pointId,
        name: object.name || `Point (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`,
        type: 'point',
        object: object,
        children: [],
        visible: object.visible,
        selected: selectedObject?.id === pointId
      };
      objects.push(pointObject);
    }
  });

  // Add measurement groups
  scene.traverse((object) => {
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
        selected: selectedObject?.id === measurementId,
        measurementData: measurementData ? {
          startPoint: measurementData.startPoint,
          endPoint: measurementData.endPoint,
          distance: measurementData.distance
        } : undefined
      };
      objects.push(measurementObject);
    }
  });

  // Add environment objects
  const groundObject = scene.children.find(child => 
    child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry && child.userData.isHelper
  );
  
  if (groundObject) {
    const groundId = 'ground';
    objects.push({
      id: groundId,
      name: 'Ground Plane',
      type: 'ground',
      object: groundObject,
      children: [],
      visible: groundObject.visible,
      selected: selectedObject?.id === groundId
    });
  }

  return objects;
};

const buildChildren = (object: THREE.Object3D, selectedObject: SceneObject | null): SceneObject[] => {
  return object.children
    .filter(child => !child.userData.isHelper)
    .map(child => {
      const childId = `child_${child.uuid}`;
      return {
        id: childId,
        name: child.name || `${child.type}_${child.uuid.slice(0, 8)}`,
        type: child instanceof THREE.Mesh ? 'mesh' : 'group',
        object: child,
        children: buildChildren(child, selectedObject),
        visible: child.visible,
        selected: selectedObject?.id === childId
      };
    });
};

export const groupSceneObjects = (sceneObjects: SceneObject[]) => {
  return {
    models: sceneObjects.filter(obj => obj.type === 'group'),
    primitives: sceneObjects.filter(obj => obj.type === 'primitive'),
    points: sceneObjects.filter(obj => obj.type === 'point'),
    measurements: sceneObjects.filter(obj => obj.type === 'measurement'),
    environment: sceneObjects.filter(obj => obj.type === 'ground')
  };
};
