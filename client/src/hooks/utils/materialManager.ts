
import * as THREE from 'three';

export class MaterialManager {
  private hoverMaterials: Map<string, THREE.Material> = new Map();
  private originalMaterials: Map<string, THREE.Material | THREE.Material[]> = new Map();
  private hoverOutlines: THREE.Object3D[] = [];

  constructor() {
    console.log('MaterialManager: Initializing');
    // Ensure hoverOutlines is always an array
    this.hoverOutlines = [];
  }

  setHoverEffect(object: THREE.Object3D, hover: boolean): void {
    try {
      if (!object) {
        console.warn('MaterialManager: Attempted to set hover effect on null object');
        return;
      }

      const objectId = object.uuid;

      if (hover) {
        this.applyHoverEffect(object, objectId);
      } else {
        this.removeHoverEffect(object, objectId);
      }
    } catch (error) {
      console.error('MaterialManager: Error setting hover effect:', error);
    }
  }

  private applyHoverEffect(object: THREE.Object3D, objectId: string): void {
    try {
      if (object instanceof THREE.Mesh && object.material) {
        // Store original material
        if (!this.originalMaterials.has(objectId)) {
          this.originalMaterials.set(objectId, object.material);
        }

        // Create hover material
        let hoverMaterial = this.hoverMaterials.get(objectId);
        if (!hoverMaterial) {
          const originalMaterial = Array.isArray(object.material) 
            ? object.material[0] 
            : object.material;

          if (originalMaterial instanceof THREE.MeshStandardMaterial) {
            hoverMaterial = originalMaterial.clone();
            (hoverMaterial as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x444444);
            (hoverMaterial as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
          } else {
            hoverMaterial = new THREE.MeshStandardMaterial({
              color: 0x666666,
              emissive: 0x444444,
              emissiveIntensity: 0.3
            });
          }
          
          this.hoverMaterials.set(objectId, hoverMaterial);
        }

        object.material = hoverMaterial;
      }
    } catch (error) {
      console.error('MaterialManager: Error applying hover effect:', error);
    }
  }

  private removeHoverEffect(object: THREE.Object3D, objectId: string): void {
    try {
      if (object instanceof THREE.Mesh && this.originalMaterials.has(objectId)) {
        const originalMaterial = this.originalMaterials.get(objectId);
        if (originalMaterial) {
          object.material = originalMaterial;
        }
      }
    } catch (error) {
      console.error('MaterialManager: Error removing hover effect:', error);
    }
  }

  dispose(): void {
    try {
      console.log('MaterialManager: Disposing resources');
      
      // Dispose hover materials
      this.hoverMaterials.forEach((material) => {
        if (material && typeof material.dispose === 'function') {
          material.dispose();
        }
      });
      this.hoverMaterials.clear();

      // Clear original materials map
      this.originalMaterials.clear();

      // Ensure hoverOutlines is an array before calling forEach
      if (Array.isArray(this.hoverOutlines)) {
        this.hoverOutlines.forEach((outline) => {
          if (outline && outline.parent) {
            outline.parent.remove(outline);
          }
        });
      }
      this.hoverOutlines = [];

      console.log('MaterialManager: Disposal complete');
    } catch (error) {
      console.error('MaterialManager: Error during disposal:', error);
    }
  }
}
