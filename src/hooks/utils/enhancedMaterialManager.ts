
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
  private hoverMaterial: THREE.MeshStandardMaterial;
  private selectionMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.hoverMaterial = this.resourceManager.getMaterial('hover', () => 
      new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x442200,
        emissiveIntensity: 0.4,
        transparent: false
      })
    ) as THREE.MeshStandardMaterial;

    this.selectionMaterial = this.resourceManager.getMaterial('selection', () => 
      new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x004400,
        emissiveIntensity: 0.3,
        transparent: false
      })
    ) as THREE.MeshStandardMaterial;
  }

  setObjectState(object: THREE.Object3D, updates: Partial<MaterialState>) {
    // Store original material if not already stored
    if (!this.originalMaterials.has(object)) {
      this.storeOriginalMaterial(object);
    }

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

    // Apply material based on priority: selection > hover > custom > original
    this.applyMaterialByPriority(object, newState);
  }

  setHoverEffect(object: THREE.Object3D, hover: boolean) {
    this.setObjectState(object, { isHovered: hover });
  }

  setSelectionEffect(object: THREE.Object3D, selected: boolean) {
    this.setObjectState(object, { isSelected: selected });
  }

  setMaterialType(object: THREE.Object3D, type: MaterialType, parameters?: Partial<MaterialParameters>) {
    const finalParameters = { 
      ...this.getDefaultParameters(), 
      ...parameters 
    };
    this.setObjectState(object, { type, parameters: finalParameters });
  }

  updateMaterialParameters(object: THREE.Object3D, parameters: Partial<MaterialParameters>) {
    const currentState = this.objectStates.get(object);
    if (currentState) {
      const newParameters = { ...currentState.parameters, ...parameters };
      this.setObjectState(object, { parameters: newParameters });
    }
  }

  private storeOriginalMaterial(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh) {
      this.originalMaterials.set(object, object.material);
    }

    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        this.originalMaterials.set(child, child.material);
      }
    });
  }

  private applyMaterialByPriority(object: THREE.Object3D, state: MaterialState) {
    let materialToApply: THREE.Material;

    // Priority: selection > hover > custom material > original
    if (state.isSelected) {
      materialToApply = this.selectionMaterial;
    } else if (state.isHovered) {
      materialToApply = this.hoverMaterial;
    } else if (state.type !== 'default') {
      materialToApply = this.createCustomMaterial(state.type, state.parameters);
    } else {
      // Restore original material
      this.restoreOriginalMaterial(object);
      return;
    }

    this.applyMaterialToObject(object, materialToApply);
  }

  private createCustomMaterial(type: MaterialType, parameters: MaterialParameters): THREE.Material {
    const cacheKey = `${type}_${JSON.stringify(parameters)}`;
    
    return this.resourceManager.getMaterial(cacheKey, () => {
      switch (type) {
        case 'wood':
          return new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8 - parameters.reflection * 0.5,
            metalness: 0.1,
            transparent: parameters.opacity < 1,
            opacity: parameters.opacity,
            emissiveIntensity: parameters.edge * 0.2
          });

        case 'matPaint':
          return new THREE.MeshLambertMaterial({
            color: 0x666666,
            transparent: parameters.opacity < 1,
            opacity: parameters.opacity,
            reflectivity: parameters.reflection * 0.3
          });

        case 'metal':
          return new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            roughness: 0.2 - parameters.reflection * 0.15,
            metalness: 0.9,
            transparent: parameters.opacity < 1,
            opacity: parameters.opacity,
            emissiveIntensity: parameters.edge * 0.1
          });

        case 'plastic':
          return new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            shininess: 100 * parameters.reflection,
            transparent: parameters.opacity < 1,
            opacity: parameters.opacity,
            specular: 0x222222
          });

        case 'glass':
          return new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0,
            roughness: 0.1,
            transparent: true,
            opacity: parameters.opacity * 0.3,
            transmission: 0.9,
            ior: parameters.refraction,
            thickness: parameters.thickness
          });

        default:
          return new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
    }) as THREE.Material;
  }

  private applyMaterialToObject(object: THREE.Object3D, material: THREE.Material) {
    if (object instanceof THREE.Mesh) {
      object.material = material;
    }

    object.children.forEach(child => {
      if (child instanceof THREE.Mesh && !child.userData.isHelper) {
        child.material = material;
      }
    });
  }

  private restoreOriginalMaterial(object: THREE.Object3D) {
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
    // Clear all states and restore original materials
    this.objectStates = new WeakMap();
    this.originalMaterials.forEach((material, object) => {
      if (object instanceof THREE.Mesh) {
        object.material = material;
      }
    });
  }

  getObjectState(object: THREE.Object3D): MaterialState | null {
    return this.objectStates.get(object) || null;
  }

  dispose() {
    this.clearAllEffects();
    this.originalMaterials = new WeakMap();
  }
}
