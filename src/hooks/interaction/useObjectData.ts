
import { useState, useCallback } from 'react';
import * as THREE from 'three';

interface ObjectData {
  name: string;
  type: string;
  vertices?: number;
  triangles?: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
}

export const useObjectData = () => {
  const [objectData, setObjectData] = useState<ObjectData | null>(null);

  const extractObjectData = useCallback((object: THREE.Object3D): ObjectData => {
    let vertices = 0;
    let triangles = 0;

    if (object instanceof THREE.Mesh && object.geometry) {
      const geometry = object.geometry;
      if (geometry.attributes.position) {
        vertices = geometry.attributes.position.count;
      }
      if (geometry.index) {
        triangles = geometry.index.count / 3;
      } else {
        triangles = vertices / 3;
      }
    }

    return {
      name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
      type: object.type,
      vertices: vertices > 0 ? vertices : undefined,
      triangles: triangles > 0 ? Math.floor(triangles) : undefined,
      position: object.position.clone(),
      rotation: object.rotation.clone(),
      scale: object.scale.clone(),
      visible: object.visible
    };
  }, []);

  return {
    objectData,
    setObjectData,
    extractObjectData
  };
};
