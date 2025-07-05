
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObject: any
): SceneObject[] => {
  if (!scene) return [];

  const objects: SceneObject[] = [];

  // Add loaded models
  loadedModels.forEach(model => {
    const modelObject: SceneObject = {
      id: `model_${model.id}`,
      name: model.name,
      type: 'group',
      object: model.object,
      children: buildChildren(model.object, selectedObject),
      visible: model.object.visible,
      selected: selectedObject?.id === `model_${model.id}`
    };
    objects.push(modelObject);
  });

  // Add primitives if showing
  if (showPrimitives) {
    scene.traverse((object) => {
      if (object.userData.isPrimitive) {
        const primitiveObject: SceneObject = {
          id: `primitive_${object.uuid}`,
          name: object.name || 'Box Primitive',
          type: 'primitive',
          object: object,
          children: [],
          visible: object.visible,
          selected: selectedObject?.id === `primitive_${object.uuid}`
        };
        objects.push(primitiveObject);
      }
    });
  }

  // Add points
  scene.traverse((object) => {
    if (object.userData.isPoint) {
      const pointObject: SceneObject = {
        id: `point_${object.uuid}`,
        name: object.name || `Point (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`,
        type: 'point',
        object: object,
        children: [],
        visible: object.visible,
        selected: selectedObject?.id === `point_${object.uuid}`
      };
      objects.push(pointObject);
    }
  });

  // Add measurement groups
  scene.traverse((object) => {
    if (object.userData.isMeasurementGroup && object instanceof THREE.Group) {
      const measurementData = object.userData.measurementData;
      const distance = measurementData ? measurementData.distance : 0;
      
      const measurementObject: SceneObject = {
        id: `measurement_${object.uuid}`,
        name: `Measurement (${distance.toFixed(3)} units)`,
        type: 'measurement',
        object: object,
        children: [],
        visible: object.visible,
        selected: selectedObject?.id === `measurement_${object.uuid}`,
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
    objects.push({
      id: 'ground',
      name: 'Ground Plane',
      type: 'ground',
      object: groundObject,
      children: [],
      visible: groundObject.visible,
      selected: selectedObject?.id === 'ground'
    });
  }

  return objects;
};

const buildChildren = (object: THREE.Object3D, selectedObject: any): SceneObject[] => {
  return object.children
    .filter(child => !child.userData.isHelper)
    .map(child => ({
      id: `child_${child.uuid}`,
      name: child.name || `${child.type}_${child.uuid.slice(0, 8)}`,
      type: child instanceof THREE.Mesh ? 'mesh' : 'group',
      object: child,
      children: buildChildren(child, selectedObject),
      visible: child.visible,
      selected: selectedObject?.id === `child_${child.uuid}`
    }));
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
