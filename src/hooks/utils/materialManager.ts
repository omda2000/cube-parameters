
import * as THREE from 'three';

export class MaterialManager {
  private originalMaterials = new Map<THREE.Object3D, THREE.Material | THREE.Material[]>();
  private hoverMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0x442200,
      emissiveIntensity: 0.4,
      transparent: false
    });
  }

  setHoverEffect(object: THREE.Object3D, hover: boolean) {
    if (object instanceof THREE.Mesh) {
      if (hover) {
        if (!this.originalMaterials.has(object)) {
          this.originalMaterials.set(object, object.material);
        }
        object.material = this.hoverMaterial;
      } else {
        this.clearHoverEffect(object);
      }
    }

    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        if (hover) {
          if (!this.originalMaterials.has(child)) {
            this.originalMaterials.set(child, child.material);
          }
          child.material = this.hoverMaterial;
        } else {
          const originalMaterial = this.originalMaterials.get(child);
          if (originalMaterial) {
            child.material = originalMaterial;
            this.originalMaterials.delete(child);
          }
        }
      }
    });
  }

  clearHoverEffect(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh) {
      const originalMaterial = this.originalMaterials.get(object);
      if (originalMaterial) {
        object.material = originalMaterial;
        this.originalMaterials.delete(object);
      }
    }

    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        const originalMaterial = this.originalMaterials.get(child);
        if (originalMaterial) {
          child.material = originalMaterial;
          this.originalMaterials.delete(child);
        }
      }
    });
  }

  dispose() {
    this.hoverMaterial.dispose();
    this.originalMaterials.clear();
  }
}
