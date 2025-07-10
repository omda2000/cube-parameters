
import { useRef, useCallback } from 'react';
import { EnhancedMaterialManager, MaterialType, MaterialParameters, MaterialState } from './utils/enhancedMaterialManager';
import * as THREE from 'three';

export const useMaterialManager = () => {
  const materialManagerRef = useRef<EnhancedMaterialManager | null>(null);

  const getMaterialManager = useCallback(() => {
    if (!materialManagerRef.current) {
      materialManagerRef.current = new EnhancedMaterialManager();
    }
    return materialManagerRef.current;
  }, []);

  const updateObjectMaterial = useCallback((
    object: THREE.Object3D,
    type: MaterialType,
    parameters?: Partial<MaterialParameters>
  ) => {
    const manager = getMaterialManager();
    manager.setMaterialType(object, type, parameters);
  }, [getMaterialManager]);

  const updateMaterialParameters = useCallback((
    object: THREE.Object3D,
    parameters: Partial<MaterialParameters>
  ) => {
    const manager = getMaterialManager();
    manager.updateMaterialParameters(object, parameters);
  }, [getMaterialManager]);

  const getObjectMaterialState = useCallback((object: THREE.Object3D): MaterialState | null => {
    const manager = getMaterialManager();
    return manager.getObjectState(object);
  }, [getMaterialManager]);

  const setHoverEffect = useCallback((object: THREE.Object3D, hover: boolean) => {
    const manager = getMaterialManager();
    manager.setHoverEffect(object, hover);
  }, [getMaterialManager]);

  const setSelectionEffect = useCallback((object: THREE.Object3D, selected: boolean) => {
    const manager = getMaterialManager();
    manager.setSelectionEffect(object, selected);
  }, [getMaterialManager]);

  return {
    materialManager: getMaterialManager(),
    updateObjectMaterial,
    updateMaterialParameters,
    getObjectMaterialState,
    setHoverEffect,
    setSelectionEffect
  };
};
