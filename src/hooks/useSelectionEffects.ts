
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

export const useSelectionEffects = (selectedObject: SceneObject | null) => {
  const originalMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const outlineRef = useRef<THREE.LineSegments | null>(null);
  const overlayMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Create materials once
  useEffect(() => {
    if (!overlayMaterialRef.current) {
      overlayMaterialRef.current = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3,
        depthTest: false,
        depthWrite: false
      });
    }
  }, []);

  const createBlueOutline = (object: THREE.Object3D) => {
    const edges = new THREE.EdgesGeometry(
      object instanceof THREE.Mesh ? object.geometry : new THREE.BoxGeometry()
    );
    const outlineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x0088ff, 
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);
    
    // Match the object's transform
    outline.position.copy(object.position);
    outline.rotation.copy(object.rotation);
    outline.scale.copy(object.scale);
    outline.userData.isHelper = true;
    
    return outline;
  };

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean) => {
    const originalMaterials = originalMaterialsRef.current;
    const overlayMaterial = overlayMaterialRef.current;
    
    if (!overlayMaterial) return;

    if (object instanceof THREE.Mesh) {
      if (selected) {
        // Store original material
        if (!originalMaterials.has(object)) {
          originalMaterials.set(object, object.material);
        }
        
        // Create blue outline
        const outline = createBlueOutline(object);
        outlineRef.current = outline;
        object.parent?.add(outline);
        
        // Apply red overlay
        const originalMaterial = originalMaterials.get(object);
        if (Array.isArray(originalMaterial)) {
          object.material = [...originalMaterial, overlayMaterial];
        } else {
          object.material = [originalMaterial as THREE.Material, overlayMaterial];
        }
      } else {
        // Remove outline
        if (outlineRef.current) {
          outlineRef.current.parent?.remove(outlineRef.current);
          outlineRef.current = null;
        }
        
        // Restore original material
        const originalMaterial = originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
          originalMaterials.delete(object);
        }
      }
    }

    // Apply to children recursively
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        if (selected) {
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material);
          }
          
          const originalMaterial = originalMaterials.get(child);
          if (Array.isArray(originalMaterial)) {
            child.material = [...originalMaterial, overlayMaterial];
          } else {
            child.material = [originalMaterial as THREE.Material, overlayMaterial];
          }
        } else {
          const originalMaterial = originalMaterials.get(child);
          if (originalMaterial) {
            child.material = originalMaterial;
            originalMaterials.delete(child);
          }
        }
      }
    });
  };

  // Apply/remove selection effects when selectedObject changes
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, false);
      }
      if (overlayMaterialRef.current) {
        overlayMaterialRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedObject?.object) {
      applySelectionEffects(selectedObject.object, true);
    }

    return () => {
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, false);
      }
    };
  }, [selectedObject]);
};
