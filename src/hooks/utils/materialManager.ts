
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
        // Only store original material if not already stored
        if (!this.originalMaterials.has(object)) {
          this.originalMaterials.set(object, object.material);
        }
        this.hoveredObjects.add(object);
        
        // Create a new hover material based on original
        const originalMat = this.originalMaterials.get(object);
        const hoverMat = this.hoverMaterial.clone();
        
        if (originalMat instanceof THREE.Material) {
          hoverMat.copy(originalMat);
          hoverMat.color.setHex(0xffff00);
          hoverMat.opacity = 0.3;
          hoverMat.transparent = true;
        }
        
        object.material = hoverMat;
      } else {
        // Restore original material immediately
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
          this.originalMaterials.delete(object);
        }
        this.hoveredObjects.delete(object);
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
