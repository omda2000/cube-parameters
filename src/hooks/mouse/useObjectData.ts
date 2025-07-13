
import { useState, useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ObjectData {
  name: string;
  id: string;
  type: string;
  position: THREE.Vector3;
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
        id: 'loading',
        type: 'Object3D',
        position: new THREE.Vector3()
      };
    }

    // Generate consistent ID using the same logic as scene tree
    let objectId = '';
    if (object.userData?.id) {
      objectId = object.userData.id;
    } else if (object.userData?.isPrimitive) {
      objectId = `primitive_${object.uuid.slice(0, 8)}`;
    } else if (object.userData?.isPoint) {
      objectId = `point_${object.uuid.slice(0, 8)}`;
    } else {
      objectId = `${object.type}_${object.uuid.slice(0, 8)}`;
    }

    // Use userData name if available, otherwise fallback to object name
    const displayName = object.userData?.name || object.name || `${object.type}_${object.uuid.slice(0, 8)}`;

    return {
      name: displayName,
      id: objectId,
      type: object.userData?.type || object.type,
      position: object.position.clone()
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
