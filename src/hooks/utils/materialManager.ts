
import * as THREE from 'three';

export class MaterialManager {
  private originalMaterials = new Map<THREE.Object3D, THREE.Material | THREE.Material[]>();
  private hoverMaterial: THREE.MeshStandardMaterial;
  private hoveredObjects = new Set<THREE.Object3D>();

  constructor() {
    this.hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
  }

  setHoverEffect(object: THREE.Object3D, isHovering: boolean) {
    if (object instanceof THREE.Mesh) {
      if (isHovering) {
        // Only store original material if not already stored and not currently hovering
        if (!this.originalMaterials.has(object) && !this.hoveredObjects.has(object)) {
          this.originalMaterials.set(object, object.material);
        }
        this.hoveredObjects.add(object);
        
        // Create a new hover material based on original
        const originalMat = this.originalMaterials.get(object);
        const hoverMat = this.hoverMaterial.clone();
        
        if (originalMat instanceof THREE.Material) {
          // Preserve current material properties (user may have modified them)
          const currentMat = object.material as THREE.MeshStandardMaterial;
          hoverMat.copy(currentMat);
          hoverMat.color.setHex(0xffff00);
          hoverMat.opacity = Math.min(0.7, currentMat.opacity + 0.3); // Make it more visible but respect opacity
          hoverMat.transparent = true;
        }
        
        object.material = hoverMat;
      } else {
        // Restore original material or current material state
        const mesh = object as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          // If the material has user-modified properties, use those
          if (mesh.material.userData.originalProperties) {
            const currentMat = mesh.material;
            const originalMaterial = this.originalMaterials.get(object) as THREE.MeshStandardMaterial;
            
            if (originalMaterial) {
              // Create a new material with user modifications
              const restoredMat = originalMaterial.clone();
              restoredMat.color.copy(currentMat.color);
              restoredMat.metalness = currentMat.metalness;
              restoredMat.roughness = currentMat.roughness;
              restoredMat.envMapIntensity = currentMat.envMapIntensity;
              restoredMat.opacity = currentMat.userData.originalProperties.opacity;
              restoredMat.transparent = currentMat.userData.originalProperties.transparent;
              restoredMat.userData = currentMat.userData;
              restoredMat.needsUpdate = true;
              
              object.material = restoredMat;
            }
          } else {
            // No user modifications, restore original
            const originalMaterial = this.originalMaterials.get(object);
            if (originalMaterial) {
              object.material = originalMaterial;
            }
          }
        }
        
        this.hoveredObjects.delete(object);
        this.originalMaterials.delete(object);
      }
    }

    // Handle children recursively
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        this.setHoverEffect(child, isHovering);
      }
    });
  }

  // Clear all hover effects - useful for cleanup
  clearAllHoverEffects() {
    this.hoveredObjects.forEach(object => {
      if (object instanceof THREE.Mesh) {
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
        }
      }
    });
    this.originalMaterials.clear();
    this.hoveredObjects.clear();
  }

  dispose() {
    this.clearAllHoverEffects();
    this.hoverMaterial.dispose();
  }
}
