
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { SceneObject } from '../types/model';

export const useSelectionEffects = (selectedObject: SceneObject | null) => {
  const originalMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const outlineRef = useRef<THREE.LineSegments | null>(null);
  const overlayMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const pointOutlineRef = useRef<THREE.Mesh | null>(null);
  const lineOutlineRef = useRef<THREE.Line | null>(null);

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
    if (object instanceof THREE.Mesh) {
      const edges = new THREE.EdgesGeometry(object.geometry);
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
    }
    return null;
  };

  const createPointSelectionEffect = (pointObject: THREE.Object3D) => {
    if (pointObject instanceof THREE.Mesh) {
      const geometry = new THREE.SphereGeometry(0.12, 16, 16);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff,
        transparent: true,
        opacity: 0.5,
        depthTest: false
      });
      const outline = new THREE.Mesh(geometry, material);
      outline.position.copy(pointObject.position);
      outline.userData.isHelper = true;
      return outline;
    }
    return null;
  };

  const createLineSelectionEffect = (lineObject: THREE.Object3D) => {
    if (lineObject instanceof THREE.Line) {
      const geometry = lineObject.geometry.clone();
      const material = new THREE.LineBasicMaterial({ 
        color: 0x0088ff,
        linewidth: 5,
        transparent: true,
        opacity: 0.8
      });
      const outline = new THREE.Line(geometry, material);
      outline.position.copy(lineObject.position);
      outline.rotation.copy(lineObject.rotation);
      outline.scale.copy(lineObject.scale);
      outline.userData.isHelper = true;
      return outline;
    }
    return null;
  };

  const applySelectionEffects = (object: THREE.Object3D, selected: boolean, objectType?: string) => {
    const originalMaterials = originalMaterialsRef.current;
    const overlayMaterial = overlayMaterialRef.current;
    
    if (!overlayMaterial) return;

    // Handle points
    if (objectType === 'point') {
      if (selected) {
        const pointOutline = createPointSelectionEffect(object);
        if (pointOutline) {
          pointOutlineRef.current = pointOutline;
          object.parent?.add(pointOutline);
        }
      } else {
        if (pointOutlineRef.current) {
          pointOutlineRef.current.parent?.remove(pointOutlineRef.current);
          pointOutlineRef.current.geometry.dispose();
          (pointOutlineRef.current.material as THREE.Material).dispose();
          pointOutlineRef.current = null;
        }
      }
      return;
    }

    // Handle measurements
    if (objectType === 'measurement') {
      if (selected) {
        const lineOutline = createLineSelectionEffect(object);
        if (lineOutline) {
          lineOutlineRef.current = lineOutline;
          object.parent?.add(lineOutline);
        }
      } else {
        if (lineOutlineRef.current) {
          lineOutlineRef.current.parent?.remove(lineOutlineRef.current);
          lineOutlineRef.current.geometry.dispose();
          (lineOutlineRef.current.material as THREE.Material).dispose();
          lineOutlineRef.current = null;
        }
      }
      return;
    }

    // Handle meshes (existing logic)
    if (object instanceof THREE.Mesh) {
      if (selected) {
        // Store original material
        if (!originalMaterials.has(object)) {
          originalMaterials.set(object, object.material);
        }
        
        // Create blue outline
        const outline = createBlueOutline(object);
        if (outline) {
          outlineRef.current = outline;
          object.parent?.add(outline);
        }
        
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
          outlineRef.current.geometry.dispose();
          (outlineRef.current.material as THREE.Material).dispose();
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
        applySelectionEffects(selectedObject.object, false, selectedObject.type);
      }
      if (overlayMaterialRef.current) {
        overlayMaterialRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedObject?.object) {
      applySelectionEffects(selectedObject.object, true, selectedObject.type);
    }

    return () => {
      if (selectedObject?.object) {
        applySelectionEffects(selectedObject.object, false, selectedObject.type);
      }
    };
  }, [selectedObject]);
};
