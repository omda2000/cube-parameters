
import * as THREE from 'three';

export const applyMaterialOverlay = (
  object: THREE.Object3D, 
  overlayMaterial: THREE.Material,
  originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]>
) => {
  if (object instanceof THREE.Mesh) {
    // Store original material
    if (!originalMaterials.has(object)) {
      originalMaterials.set(object, object.material);
    }
    
    // Apply red overlay
    const originalMaterial = originalMaterials.get(object);
    if (Array.isArray(originalMaterial)) {
      object.material = [...originalMaterial, overlayMaterial];
    } else {
      object.material = [originalMaterial as THREE.Material, overlayMaterial];
    }
  }

  // Apply to children recursively (but skip measurement groups as they're handled separately)
  if (!object.userData.isMeasurementGroup) {
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        if (!originalMaterials.has(child)) {
          originalMaterials.set(child, child.material);
        }
        
        const originalMaterial = originalMaterials.get(child);
        if (Array.isArray(originalMaterial)) {
          child.material = [...originalMaterial, overlayMaterial];
        } else {
          child.material = [originalMaterial as THREE.Material, overlayMaterial];
        }
      }
    });
  }
};

export const restoreOriginalMaterials = (
  object: THREE.Object3D,
  originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]>
) => {
  if (object instanceof THREE.Mesh) {
    const originalMaterial = originalMaterials.get(object);
    if (originalMaterial) {
      object.material = originalMaterial;
      originalMaterials.delete(object);
    }
  }

  // Restore materials for children (but skip measurement groups)
  if (!object.userData.isMeasurementGroup) {
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        const originalMaterial = originalMaterials.get(child);
        if (originalMaterial) {
          child.material = originalMaterial;
          originalMaterials.delete(child);
        }
      }
    });
  }
};
