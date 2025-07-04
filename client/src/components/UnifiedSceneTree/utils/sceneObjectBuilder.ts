
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObject: any
): SceneObject[] => {
  if (!scene) return [];

  const loadedMap = new Map<THREE.Object3D, LoadedModel>();
  loadedModels.forEach(model => loadedMap.set(model.object, model));

  const buildObject = (object: THREE.Object3D): SceneObject | null => {
    if (object.userData.isHelper) return null;

    const isModel = loadedMap.has(object);

    const type: SceneObject['type'] = object.userData.isPrimitive
      ? 'primitive'
      : object.userData.isPoint
        ? 'point'
        : object.userData.isMeasurementGroup
          ? 'measurement'
          : object instanceof THREE.Light
            ? 'light'
            : object instanceof THREE.Mesh
              ? 'mesh'
              : 'group';

    if (type === 'primitive' && !showPrimitives) return null;

    const id = isModel
      ? `model_${loadedMap.get(object)!.id}`
      : type === 'primitive'
        ? `primitive_${object.uuid}`
        : type === 'point'
          ? `point_${object.uuid}`
          : type === 'measurement'
            ? `measurement_${object.uuid}`
            : `object_${object.uuid}`;

    const name = isModel
      ? loadedMap.get(object)!.name
      : object.name || (type === 'primitive' ? 'Box Primitive' : `${object.type}_${object.uuid.slice(0, 8)}`);

    const children = object.children
      .map(child => buildObject(child))
      .filter(Boolean) as SceneObject[];

    return {
      id,
      name,
      type,
      object,
      children,
      visible: object.visible,
      selected: selectedObject?.id === id
    };
  };

  const objects: SceneObject[] = [];
  scene.children.forEach(child => {
    const obj = buildObject(child);
    if (obj) objects.push(obj);
  });

  const groundObject = scene.children.find(child =>
    child instanceof THREE.Mesh &&
    child.geometry instanceof THREE.PlaneGeometry &&
    child.userData.isHelper
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


export const groupSceneObjects = (sceneObjects: SceneObject[]) => {
  return {
    models: sceneObjects.filter(obj => obj.type === 'group' || obj.type === 'mesh'),
    primitives: sceneObjects.filter(obj => obj.type === 'primitive'),
    points: sceneObjects.filter(obj => obj.type === 'point'),
    measurements: sceneObjects.filter(obj => obj.type === 'measurement'),
    environment: sceneObjects.filter(obj => obj.type === 'ground' || obj.type === 'light')
  };
};
