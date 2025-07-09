
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
        if (!this.originalMaterials.has(object)) {
          this.originalMaterials.set(object, object.material);
        }
        this.hoveredObjects.add(object);

        const currentMat = object.material as THREE.Material;
        const hoverMat = this.hoverMaterial.clone();

        if (currentMat instanceof THREE.Material) {
          (hoverMat as THREE.MeshStandardMaterial).copy(currentMat as any);
        }

        hoverMat.color.setHex(0xffff00);
        (hoverMat as THREE.MeshStandardMaterial).transparent = true;
        object.material = hoverMat;
      } else {
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
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
