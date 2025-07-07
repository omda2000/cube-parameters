
import * as THREE from 'three';
import type { LoadedModel, SceneObject } from '../../../types/model';

export const buildSceneObjects = (
  scene: THREE.Scene | null,
  loadedModels: LoadedModel[],
  showPrimitives: boolean,
  selectedObjects: SceneObject[] = []
): SceneObject[] => {
  if (!scene) return [];

  const sceneObjects: SceneObject[] = [];
  const processedObjects = new Set<string>();

  // Helper function to create consistent IDs
  const createObjectId = (object: THREE.Object3D): string => {
    if (object.userData.isPrimitive) return `primitive_${object.uuid}`;
    if (object.userData.isPoint) return `point_${object.uuid}`;
    if (object.userData.isMeasurementGroup) return `measurement_${object.uuid}`;
    return `object_${object.uuid}`;
  };

  // Helper function to check if object is selected
  const isObjectSelected = (objectId: string): boolean => {
    return selectedObjects.some(selected => selected.id === objectId);
  };

  // Process loaded models
  loadedModels.forEach((model, index) => {
    if (model.object && !processedObjects.has(model.object.uuid)) {
      const objectId = createObjectId(model.object);
      const sceneObject: SceneObject = {
        id: objectId,
        name: model.name || `Model ${index + 1}`,
        type: 'mesh',
        object: model.object,
        children: [],
        visible: model.object.visible,
        selected: isObjectSelected(objectId)
      };

      // Process children recursively
      const processChildren = (parent: THREE.Object3D, parentSceneObject: SceneObject) => {
        parent.children.forEach(child => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
            const childId = createObjectId(child);
            const childSceneObject: SceneObject = {
              id: childId,
              name: child.name || `${child.type}_${child.uuid.slice(0, 8)}`,
              type: child instanceof THREE.Mesh ? 'mesh' : 'group',
              object: child,
              children: [],
              visible: child.visible,
              selected: isObjectSelected(childId)
            };
            parentSceneObject.children.push(childSceneObject);
            processChildren(child, childSceneObject);
          }
        });
      };

      processChildren(model.object, sceneObject);
      sceneObjects.push(sceneObject);
      processedObjects.add(model.object.uuid);
    }
  });

  // Process points, measurements, and primitives
  scene.traverse((object) => {
    if (processedObjects.has(object.uuid)) return;

    const objectId = createObjectId(object);

    // Points
    if (object.userData.isPoint && object instanceof THREE.Mesh) {
      sceneObjects.push({
        id: objectId,
        name: object.name || `Point_${object.uuid.slice(0, 8)}`,
        type: 'point',
        object: object,
        children: [],
        visible: object.visible,
        selected: isObjectSelected(objectId)
      });
      processedObjects.add(object.uuid);
    }

    // Measurements
    if (object.userData.isMeasurementGroup && object instanceof THREE.Group) {
      sceneObjects.push({
        id: objectId,
        name: object.name || `Measurement_${object.uuid.slice(0, 8)}`,
        type: 'measurement',
        object: object,
        children: [],
        visible: object.visible,
        selected: isObjectSelected(objectId)
      });
      processedObjects.add(object.uuid);
    }

    // Primitives (if enabled)
    if (showPrimitives && object.userData.isPrimitive && object instanceof THREE.Mesh) {
      sceneObjects.push({
        id: objectId,
        name: object.name || `Primitive_${object.uuid.slice(0, 8)}`,
        type: 'primitive',
        object: object,
        children: [],
        visible: object.visible,
        selected: isObjectSelected(objectId)
      });
      processedObjects.add(object.uuid);
    }
  });

  return sceneObjects;
};
