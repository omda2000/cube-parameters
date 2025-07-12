import * as THREE from 'three';
import { ResourceManager } from './ResourceManager';

export type MaterialType = 'wood' | 'matPaint' | 'metal' | 'plastic' | 'glass' | 'default';

export interface MaterialParameters {
  diffusion: number;
  opacity: number;
  reflection: number;
  refraction: number;
  edge: number;
  thickness: number;
  edgeLinePipe: number;
}

export interface MaterialState {
  type: MaterialType;
  parameters: MaterialParameters;
  isHovered: boolean;
  isSelected: boolean;
}

export class EnhancedMaterialManager {
  private originalMaterials = new WeakMap<THREE.Object3D, THREE.Material | THREE.Material[]>();
  private objectStates = new WeakMap<THREE.Object3D, MaterialState>();
  private resourceManager = ResourceManager.getInstance();
  private trackedObjects = new Set<THREE.Object3D>();
  private isDisposed = false;

  constructor() {
    // No need for hover and selection materials since we're not changing colors
  }

  setObjectState(object: THREE.Object3D, updates: Partial<MaterialState>) {
    if (this.isDisposed || !object) {
      console.warn('Material manager is disposed or object is null');
      return;
    }

    try {
      // Store original material if not already stored
      if (!this.originalMaterials.has(object)) {
        this.storeOriginalMaterial(object);
      }

      // Track this object
      this.trackedObjects.add(object);

      // Get or create current state
      const currentState = this.objectStates.get(object) || {
        type: 'default',
        parameters: this.getDefaultParameters(),
        isHovered: false,
        isSelected: false
      };

      // Update state
      const newState = { ...currentState, ...updates };
      this.objectStates.set(object, newState);

      // Only apply custom materials, not hover/selection color changes
      this.applyMaterialByPriority(object, newState);
    } catch (error) {
      console.error('Error setting object state:', error);
    }
  }

  setHoverEffect(object: THREE.Object3D, hover: boolean) {
    if (this.isDisposed || !object) return;
    
    try {
      // Only update state, don't apply color changes
      this.setObjectState(object, { isHovered: hover });
    } catch (error) {
      console.error('Error setting hover effect:', error);
    }
  }

  setSelectionEffect(object: THREE.Object3D, selected: boolean) {
    if (this.isDisposed || !object) return;
    
    try {
      // Only update state, don't apply color changes
      this.setObjectState(object, { isSelected: selected });
    } catch (error) {
      console.error('Error setting selection effect:', error);
    }
  }

  setMaterialType(object: THREE.Object3D, type: MaterialType, parameters?: Partial<MaterialParameters>) {
    if (this.isDisposed || !object) return;
    
    try {
      const finalParameters = { 
        ...this.getDefaultParameters(), 
        ...parameters 
      };
      this.setObjectState(object, { type, parameters: finalParameters });
    } catch (error) {
      console.error('Error setting material type:', error);
    }
  }

  updateMaterialParameters(object: THREE.Object3D, parameters: Partial<MaterialParameters>) {
    if (this.isDisposed || !object) return;
    
    try {
      const currentState = this.objectStates.get(object);
      if (currentState) {
        const newParameters = { ...currentState.parameters, ...parameters };
        this.setObjectState(object, { parameters: newParameters });
      }
    } catch (error) {
      console.error('Error updating material parameters:', error);
    }
  }

  private storeOriginalMaterial(object: THREE.Object3D) {
    try {
      if (object instanceof THREE.Mesh && object.material) {
        this.originalMaterials.set(object, object.material);
      }

      object.children.forEach(child => {
        if (child instanceof THREE.Mesh && !child.userData.isHelper && child.material) {
          this.originalMaterials.set(child, child.material);
        }
      });
    } catch (error) {
      console.error('Error storing original material:', error);
    }
  }

  private applyMaterialByPriority(object: THREE.Object3D, state: MaterialState) {
    try {
      // Only apply custom materials, ignore hover and selection states
      if (state.type !== 'default') {
        const materialToApply = this.createCustomMaterial(state.type, state.parameters);
        this.applyMaterialToObject(object, materialToApply);
      } else {
        // Restore original material
        this.restoreOriginalMaterial(object);
      }
    } catch (error) {
      console.error('Error applying material by priority:', error);
    }
  }

  private createCustomMaterial(type: MaterialType, parameters: MaterialParameters): THREE.Material {
    const cacheKey = `${type}_${JSON.stringify(parameters)}`;
    
    try {
      return this.resourceManager.getMaterial(cacheKey, () => {
        switch (type) {
          case 'wood':
            return new THREE.MeshStandardMaterial({
              color: 0x8B4513,
              roughness: Math.max(0, Math.min(1, 0.8 - parameters.reflection * 0.5)),
              metalness: 0.1,
              transparent: parameters.opacity < 1,
              opacity: Math.max(0, Math.min(1, parameters.opacity)),
              emissiveIntensity: Math.max(0, parameters.edge * 0.2)
            });

          case 'matPaint':
            return new THREE.MeshLambertMaterial({
              color: 0x666666,
              transparent: parameters.opacity < 1,
              opacity: Math.max(0, Math.min(1, parameters.opacity)),
              reflectivity: Math.max(0, Math.min(1, parameters.reflection * 0.3))
            });

          case 'metal':
            return new THREE.MeshStandardMaterial({
              color: 0xC0C0C0,
              roughness: Math.max(0, Math.min(1, 0.2 - parameters.reflection * 0.15)),
              metalness: 0.9,
              transparent: parameters.opacity < 1,
              opacity: Math.max(0, Math.min(1, parameters.opacity)),
              emissiveIntensity: Math.max(0, parameters.edge * 0.1)
            });

          case 'plastic':
            return new THREE.MeshPhongMaterial({
              color: 0xFFFFFF,
              shininess: Math.max(0, 100 * parameters.reflection),
              transparent: parameters.opacity < 1,
              opacity: Math.max(0, Math.min(1, parameters.opacity)),
              specular: 0x222222
            });

          case 'glass':
            return new THREE.MeshPhysicalMaterial({
              color: 0xFFFFFF,
              metalness: 0,
              roughness: 0.1,
              transparent: true,
              opacity: Math.max(0, Math.min(1, parameters.opacity * 0.3)),
              transmission: 0.9,
              ior: Math.max(1, Math.min(2.5, parameters.refraction)),
              thickness: Math.max(0, parameters.thickness)
            });

          default:
            return new THREE.MeshStandardMaterial({ color: 0x888888 });
        }
      }) as THREE.Material;
    } catch (error) {
      console.error('Error creating custom material:', error);
      return new THREE.MeshStandardMaterial({ color: 0x888888 });
    }
  }

  private applyMaterialToObject(object: THREE.Object3D, material: THREE.Material) {
    try {
      if (object instanceof THREE.Mesh) {
        object.material = material;
      }

      object.children.forEach(child => {
        if (child instanceof THREE.Mesh && !child.userData.isHelper) {
          child.material = material;
        }
      });
    } catch (error) {
      console.error('Error applying material to object:', error);
    }
  }

  private restoreOriginalMaterial(object: THREE.Object3D) {
    try {
      if (object instanceof THREE.Mesh) {
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial) {
          object.material = originalMaterial;
        }
      }

      object.children.forEach(child => {
        if (child instanceof THREE.Mesh && !child.userData.isHelper) {
          const originalMaterial = this.originalMaterials.get(child);
          if (originalMaterial) {
            child.material = originalMaterial;
          }
        }
      });
    } catch (error) {
      console.error('Error restoring original material:', error);
    }
  }

  private getDefaultParameters(): MaterialParameters {
    return {
      diffusion: 0.5,
      opacity: 1.0,
      reflection: 0.3,
      refraction: 1.4,
      edge: 0.1,
      thickness: 1.0,
      edgeLinePipe: 0.0
    };
  }

  clearAllEffects() {
    if (this.isDisposed) return;
    
    try {
      // Clear all states and restore original materials for tracked objects
      this.trackedObjects.forEach(object => {
        try {
          this.restoreOriginalMaterial(object);
        } catch (error) {
          console.warn('Error restoring material during clear:', error);
        }
      });
      this.objectStates = new WeakMap();
      this.trackedObjects.clear();
    } catch (error) {
      console.error('Error clearing all effects:', error);
    }
  }

  getObjectState(object: THREE.Object3D): MaterialState | null {
    if (this.isDisposed || !object) return null;
    return this.objectStates.get(object) || null;
  }

  dispose() {
    try {
      this.isDisposed = true;
      this.clearAllEffects();
      this.originalMaterials = new WeakMap();
    } catch (error) {
      console.error('Error disposing material manager:', error);
    }
  }
}
