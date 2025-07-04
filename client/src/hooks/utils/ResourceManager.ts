
import * as THREE from 'three';

export class ResourceManager {
  private static instance: ResourceManager;
  private geometries = new Map<string, THREE.BufferGeometry>();
  private materials = new Map<string, THREE.Material>();
  private textures = new Map<string, THREE.Texture>();

  private constructor() {}

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  getGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    if (!this.geometries.has(key)) {
      this.geometries.set(key, factory());
    }
    return this.geometries.get(key)!;
  }

  getMaterial(key: string, factory: () => THREE.Material): THREE.Material {
    if (!this.materials.has(key)) {
      this.materials.set(key, factory());
    }
    return this.materials.get(key)!;
  }

  getTexture(key: string, factory: () => THREE.Texture): THREE.Texture {
    if (!this.textures.has(key)) {
      this.textures.set(key, factory());
    }
    return this.textures.get(key)!;
  }

  disposeAll() {
    this.geometries.forEach(geometry => geometry.dispose());
    this.materials.forEach(material => material.dispose());
    this.textures.forEach(texture => texture.dispose());
    
    this.geometries.clear();
    this.materials.clear();
    this.textures.clear();
  }

  dispose(type: 'geometry' | 'material' | 'texture', key: string) {
    switch (type) {
      case 'geometry':
        const geometry = this.geometries.get(key);
        if (geometry) {
          geometry.dispose();
          this.geometries.delete(key);
        }
        break;
      case 'material':
        const material = this.materials.get(key);
        if (material) {
          material.dispose();
          this.materials.delete(key);
        }
        break;
      case 'texture':
        const texture = this.textures.get(key);
        if (texture) {
          texture.dispose();
          this.textures.delete(key);
        }
        break;
    }
  }
}
