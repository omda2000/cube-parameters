
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

interface SelectionContextType {
  selectedObject: SceneObject | null;
  selectObject: (object: SceneObject | null) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const originalMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const outlineRef = useRef<THREE.LineSegments | null>(null);

  const restoreOriginalMaterials = useCallback((object: THREE.Object3D) => {
    const originalMaterials = originalMaterialsRef.current;
    
    // Remove outline if exists
    if (outlineRef.current) {
      outlineRef.current.parent?.remove(outlineRef.current);
      outlineRef.current = null;
    }

    // Restore materials for the object
    if (object instanceof THREE.Mesh) {
      const originalMaterial = originalMaterials.get(object);
      if (originalMaterial) {
        object.material = originalMaterial;
        originalMaterials.delete(object);
      }
    }

    // Restore materials for children
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        const originalMaterial = originalMaterials.get(child);
        if (originalMaterial) {
          child.material = originalMaterial;
          originalMaterials.delete(child);
        }
      }
    });
  }, []);

  const applySelectionEffects = useCallback((object: THREE.Object3D) => {
    const originalMaterials = originalMaterialsRef.current;
    
    // Create selection material
    const selectionMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3,
      depthTest: false,
      depthWrite: false
    });

    // Create blue outline
    const createBlueOutline = (targetObject: THREE.Object3D) => {
      const edges = new THREE.EdgesGeometry(
        targetObject instanceof THREE.Mesh ? targetObject.geometry : new THREE.BoxGeometry()
      );
      const outlineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x0088ff, 
        linewidth: 3,
        transparent: true,
        opacity: 0.8
      });
      const outline = new THREE.LineSegments(edges, outlineMaterial);
      
      outline.position.copy(targetObject.position);
      outline.rotation.copy(targetObject.rotation);
      outline.scale.copy(targetObject.scale);
      outline.userData.isHelper = true;
      
      return outline;
    };

    // Apply to main object
    if (object instanceof THREE.Mesh) {
      // Store original material
      if (!originalMaterials.has(object)) {
        originalMaterials.set(object, object.material);
      }
      
      // Create outline
      const outline = createBlueOutline(object);
      outlineRef.current = outline;
      object.parent?.add(outline);
      
      // Apply selection overlay
      const originalMaterial = originalMaterials.get(object);
      if (Array.isArray(originalMaterial)) {
        object.material = [...originalMaterial, selectionMaterial];
      } else {
        object.material = [originalMaterial as THREE.Material, selectionMaterial];
      }
    }

    // Apply to children
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        if (!originalMaterials.has(child)) {
          originalMaterials.set(child, child.material);
        }
        
        const originalMaterial = originalMaterials.get(child);
        if (Array.isArray(originalMaterial)) {
          child.material = [...originalMaterial, selectionMaterial];
        } else {
          child.material = [originalMaterial as THREE.Material, selectionMaterial];
        }
      }
    });
  }, []);

  const selectObject = useCallback((object: SceneObject | null) => {
    // Clear previous selection
    if (selectedObject?.object) {
      restoreOriginalMaterials(selectedObject.object);
    }

    setSelectedObject(object);

    // Apply new selection
    if (object?.object) {
      applySelectionEffects(object.object);
    }
  }, [selectedObject, restoreOriginalMaterials, applySelectionEffects]);

  const clearSelection = useCallback(() => {
    if (selectedObject?.object) {
      restoreOriginalMaterials(selectedObject.object);
    }
    setSelectedObject(null);
  }, [selectedObject, restoreOriginalMaterials]);

  return (
    <SelectionContext.Provider value={{ selectedObject, selectObject, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
};
