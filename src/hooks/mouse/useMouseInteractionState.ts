
import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { MaterialManager } from '../utils/materialManager';

export const useMouseInteractionState = () => {
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const materialManagerRef = useRef<MaterialManager | null>(null);

  const initializeMaterialManager = useCallback(() => {
    if (!materialManagerRef.current) {
      materialManagerRef.current = new MaterialManager();
    }
    return materialManagerRef.current;
  }, []);

  const cleanupMaterialManager = useCallback(() => {
    if (materialManagerRef.current) {
      materialManagerRef.current.dispose();
      materialManagerRef.current = null;
    }
  }, []);

  const setHoveredObjectSafe = useCallback((object: THREE.Object3D | null) => {
    setHoveredObject(object);
  }, []);

  const clearHover = useCallback(() => {
    if (hoveredObject && materialManagerRef.current) {
      materialManagerRef.current.setHoverEffect(hoveredObject, false);
    }
    setHoveredObject(null);
  }, [hoveredObject]);

  return {
    hoveredObject,
    setHoveredObject: setHoveredObjectSafe,
    clearHover,
    materialManagerRef,
    initializeMaterialManager,
    cleanupMaterialManager
  };
};
