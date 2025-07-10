
import * as THREE from 'three';
import { ResourceManager } from './ResourceManager';

export class MaterialManager {
  private originalMaterials = new WeakMap<THREE.Object3D, THREE.Material | THREE.Material[]>();
  private resourceManager = ResourceManager.getInstance();
  private hoverMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.hoverMaterial = this.resourceManager.getMaterial('hover', () => 
      new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x442200,
        emissiveIntensity: 0.4,
        transparent: false
      })
    ) as THREE.MeshStandardMaterial;
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

    // Batch process children to reduce function calls
    const meshChildren = object.children.filter(child => 
      child instanceof THREE.Mesh && !child.userData.isHelper
    ) as THREE.Mesh[];

    for (const child of meshChildren) {
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
  }

  clearHoverEffect(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh) {
      const originalMaterial = this.originalMaterials.get(object);
      if (originalMaterial) {
        object.material = originalMaterial;
        this.originalMaterials.delete(object);
      }
    }
  }

  dispose() {
    // Don't dispose shared materials, let ResourceManager handle it
    this.originalMaterials = new WeakMap();
  }
}
