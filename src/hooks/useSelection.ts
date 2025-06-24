
import { useState, useCallback } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

export const useSelection = () => {
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const [highlightedObjects] = useState<THREE.Object3D[]>([]);

  const selectObject = useCallback((object: SceneObject | null) => {
    // Clear previous highlights
    highlightedObjects.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        // Remove highlight effect
        obj.userData.originalMaterial = obj.userData.originalMaterial || obj.material;
        obj.material = obj.userData.originalMaterial;
      }
    });
    highlightedObjects.length = 0;

    setSelectedObject(object);

    // Add highlight to new selection
    if (object && object.object instanceof THREE.Mesh) {
      const mesh = object.object as THREE.Mesh;
      mesh.userData.originalMaterial = mesh.userData.originalMaterial || mesh.material;
      
      const highlightMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      
      mesh.material = [mesh.userData.originalMaterial, highlightMaterial];
      highlightedObjects.push(mesh);
    }
  }, [highlightedObjects]);

  const clearSelection = useCallback(() => {
    selectObject(null);
  }, [selectObject]);

  return {
    selectedObject,
    selectObject,
    clearSelection
  };
};
