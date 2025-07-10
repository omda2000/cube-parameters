
import * as THREE from 'three';
import { ResourceManager } from './ResourceManager';

export class MaterialManager {
  private originalMaterials = new WeakMap<THREE.Object3D, THREE.Material | THREE.Material[]>();
  private resourceManager = ResourceManager.getInstance();
  private hoverMaterial: THREE.MeshStandardMaterial;
  private hoveredObjects = new Set<THREE.Object3D>();

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
    if (hover) {
      this.applyHoverEffect(object);
    } else {
      this.removeHoverEffect(object);
    }
  }

  private applyHoverEffect(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh && !this.hoveredObjects.has(object)) {
      // Store original material before applying hover
      if (!this.originalMaterials.has(object)) {
        this.originalMaterials.set(object, object.material);
      }
      object.material = this.hoverMaterial;
      this.hoveredObjects.add(object);
    }

    // Apply to mesh children
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper && !this.hoveredObjects.has(child)) {
        if (!this.originalMaterials.has(child)) {
          this.originalMaterials.set(child, child.material);
        }
        child.material = this.hoverMaterial;
        this.hoveredObjects.add(child);
      }
    });
  }

  private removeHoverEffect(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh && this.hoveredObjects.has(object)) {
      const originalMaterial = this.originalMaterials.get(object);
      if (originalMaterial) {
        object.material = originalMaterial;
        this.originalMaterials.delete(object);
      }
      this.hoveredObjects.delete(object);
    }

    // Remove from mesh children
    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && this.hoveredObjects.has(child)) {
        const originalMaterial = this.originalMaterials.get(child);
        if (originalMaterial) {
          child.material = originalMaterial;
          this.originalMaterials.delete(child);
        }
        this.hoveredObjects.delete(child);
      }
    });
  }

  clearAllHoverEffects() {
    // Clear all hover effects before applying selection
    this.hoveredObjects.forEach(object => {
      if (object instanceof THREE.Mesh) {
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
          this.originalMaterials.delete(object);
        }
      }
    });
    this.hoveredObjects.clear();
  }

  dispose() {
    this.clearAllHoverEffects();
    this.originalMaterials = new WeakMap();
  }
}
