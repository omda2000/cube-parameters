
import * as THREE from 'three';

export const applyMaterialOverlay = (
  object: THREE.Object3D, 
  overlayMaterial: THREE.Material,
  originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]>
) => {
  if (object instanceof THREE.Mesh) {
    // Store original material if not already stored
    if (!originalMaterials.has(object)) {
      originalMaterials.set(object, object.material);
    }
    
    // Create a clone of the original material and modify it
    const originalMaterial = originalMaterials.get(object);
    if (originalMaterial) {
      if (Array.isArray(originalMaterial)) {
        // Handle multi-material meshes
        const newMaterials = originalMaterial.map(mat => {
          const clonedMat = mat.clone();
          if (clonedMat instanceof THREE.MeshStandardMaterial || clonedMat instanceof THREE.MeshBasicMaterial) {
            clonedMat.transparent = true;
            clonedMat.opacity = 0.7; // Semi-transparent
            clonedMat.color = new THREE.Color(0xff0000); // Red color
          }
          return clonedMat;
        });
        object.material = newMaterials;
      } else {
        // Handle single material
        const clonedMat = originalMaterial.clone();
        if (clonedMat instanceof THREE.MeshStandardMaterial || clonedMat instanceof THREE.MeshBasicMaterial) {
          clonedMat.transparent = true;
          clonedMat.opacity = 0.7; // Semi-transparent
          clonedMat.color = new THREE.Color(0xff0000); // Red color
        }
        object.material = clonedMat;
      }
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
        if (originalMaterial) {
          if (Array.isArray(originalMaterial)) {
            const newMaterials = originalMaterial.map(mat => {
              const clonedMat = mat.clone();
              if (clonedMat instanceof THREE.MeshStandardMaterial || clonedMat instanceof THREE.MeshBasicMaterial) {
                clonedMat.transparent = true;
                clonedMat.opacity = 0.7;
                clonedMat.color = new THREE.Color(0xff0000);
              }
              return clonedMat;
            });
            child.material = newMaterials;
          } else {
            const clonedMat = originalMaterial.clone();
            if (clonedMat instanceof THREE.MeshStandardMaterial || clonedMat instanceof THREE.MeshBasicMaterial) {
              clonedMat.transparent = true;
              clonedMat.opacity = 0.7;
              clonedMat.color = new THREE.Color(0xff0000);
            }
            child.material = clonedMat;
          }
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
      // Dispose cloned materials before restoring
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.dispose());
      } else {
        object.material.dispose();
      }
      
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
          // Dispose cloned materials before restoring
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
          
          child.material = originalMaterial;
          originalMaterials.delete(child);
        }
      }
    });
  }
};
