
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

  // Simplified object data extraction without initialization checks
  const extractObjectData = useCallback((object: THREE.Object3D): ObjectData => {
    let vertices = 0;
    let triangles = 0;

    try {
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
    } catch (error) {
      console.error('Error extracting object data:', error);
      // Return fallback data instead of null
      return {
        name: object.name || 'Unknown Object',
        type: object.type || 'Object3D',
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        scale: new THREE.Vector3(1, 1, 1),
        visible: true
      };
    }
  }, []);

  // Simple state setter with error handling
  const safeSetObjectData = useCallback((data: ObjectData | null) => {
    try {
      setObjectData(data);
    } catch (error) {
      console.error('Error setting object data:', error);
    }
  }, []);

  return {
    objectData,
    setObjectData: safeSetObjectData,
    extractObjectData
  };
};
