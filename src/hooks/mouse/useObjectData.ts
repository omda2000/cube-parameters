
import { useState, useCallback, useRef, useEffect } from 'react';
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
  const isInitialized = useRef(false);

  // Ensure proper initialization
  useEffect(() => {
    isInitialized.current = true;
    return () => {
      isInitialized.current = false;
    };
  }, []);

  // Memoize object data extraction to avoid recalculation
  const extractObjectData = useCallback((object: THREE.Object3D): ObjectData => {
    if (!isInitialized.current) {
      return {
        name: 'Loading...',
        type: 'Object3D',
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        scale: new THREE.Vector3(1, 1, 1),
        visible: true
      };
    }

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

  const safeSetObjectData = useCallback((data: ObjectData | null) => {
    if (isInitialized.current) {
      setObjectData(data);
    }
  }, []);

  return {
    objectData,
    setObjectData: safeSetObjectData,
    extractObjectData
  };
};
