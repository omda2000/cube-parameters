
import * as THREE from 'three';

export class MaterialManager {
  private originalMaterials = new Map<THREE.Object3D, THREE.Material | THREE.Material[]>();
  private hoverMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3,
      // Preserve original material properties
      side: THREE.DoubleSide
    });
  }

  setHoverEffect(object: THREE.Object3D, isHovering: boolean) {
    if (object instanceof THREE.Mesh) {
      if (isHovering) {
        // Store original material only if not already stored
        if (!this.originalMaterials.has(object)) {
          this.originalMaterials.set(object, object.material);
        }
        // Apply hover effect while preserving base properties
        const originalMat = this.originalMaterials.get(object);
        if (originalMat instanceof THREE.Material) {
          this.hoverMaterial.copy(originalMat);
          this.hoverMaterial.color.setHex(0xffff00);
          this.hoverMaterial.opacity = 0.3;
          this.hoverMaterial.transparent = true;
        }
        object.material = this.hoverMaterial;
      } else {
        // Restore original material
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
          this.originalMaterials.delete(object);
        }
      }
    }

    // Handle children recursively
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        this.setHoverEffect(child, isHovering);
      }
    });
  }

  dispose() {
    this.hoverMaterial.dispose();
    this.originalMaterials.clear();
  }
}
