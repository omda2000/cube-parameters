
import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

export const useSelection = () => {
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const selectedMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const selectionMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Create selection material once
  if (!selectionMaterialRef.current) {
    selectionMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
      emissive: 0x004400,
      emissiveIntensity: 0.2,
      wireframe: false
    });
  }

  const applySelectionEffect = useCallback((object: THREE.Object3D, selected: boolean) => {
    const selectedMaterials = selectedMaterialsRef.current;
    const selectionMaterial = selectionMaterialRef.current;
    
    if (!selectionMaterial) return;

    if (object instanceof THREE.Mesh) {
      if (selected) {
        // Store original material
        if (!selectedMaterials.has(object)) {
          selectedMaterials.set(object, object.material);
        }
        
        // Create combined material array with original + selection overlay
        const originalMaterial = selectedMaterials.get(object);
        if (Array.isArray(originalMaterial)) {
          object.material = [...originalMaterial, selectionMaterial];
        } else {
          object.material = [originalMaterial as THREE.Material, selectionMaterial];
        }
      } else {
        // Restore original material
        const originalMaterial = selectedMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
          selectedMaterials.delete(object);
        }
      }
    }

    // Apply to children recursively
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        if (selected) {
          if (!selectedMaterials.has(child)) {
            selectedMaterials.set(child, child.material);
          }
          
          const originalMaterial = selectedMaterials.get(child);
          if (Array.isArray(originalMaterial)) {
            child.material = [...originalMaterial, selectionMaterial];
          } else {
            child.material = [originalMaterial as THREE.Material, selectionMaterial];
          }
        } else {
          const originalMaterial = selectedMaterials.get(child);
          if (originalMaterial) {
            child.material = originalMaterial;
            selectedMaterials.delete(child);
          }
        }
      }
    });
  }, []);

  const selectObject = useCallback((object: SceneObject | null) => {
    // Clear previous selection
    if (selectedObject && selectedObject.object) {
      applySelectionEffect(selectedObject.object, false);
    }

    setSelectedObject(object);

    // Apply selection to new object
    if (object && object.object) {
      applySelectionEffect(object.object, true);
    }
  }, [selectedObject, applySelectionEffect]);

  const clearSelection = useCallback(() => {
    selectObject(null);
  }, [selectObject]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (selectedObject && selectedObject.object) {
      applySelectionEffect(selectedObject.object, false);
    }
    if (selectionMaterialRef.current) {
      selectionMaterialRef.current.dispose();
    }
  }, [selectedObject, applySelectionEffect]);

  return {
    selectedObject,
    selectObject,
    clearSelection,
    cleanup
  };
};
