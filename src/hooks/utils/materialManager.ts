
import * as THREE from 'three';
import { createHoverOutline } from './outlineEffects';

export class MaterialManager {
  private hoverOutlines = new WeakMap<THREE.Object3D, THREE.LineSegments>();

  constructor() {}

  setHoverEffect(object: THREE.Object3D, hover: boolean) {
    const applyOutline = (mesh: THREE.Mesh) => {
      if (!this.hoverOutlines.has(mesh)) {
        const outline = createHoverOutline(mesh);
        if (outline) {
          this.hoverOutlines.set(mesh, outline);
          mesh.parent?.add(outline);
        }
      }
    };

    const removeOutline = (mesh: THREE.Mesh) => {
      const outline = this.hoverOutlines.get(mesh);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        this.hoverOutlines.delete(mesh);
      }
    };

    const processMesh = (mesh: THREE.Mesh) => {
      if (hover) {
        applyOutline(mesh);
      } else {
        removeOutline(mesh);
      }
    };

    if (object instanceof THREE.Mesh) {
      processMesh(object);
    }

    const meshChildren = object.children.filter(
      child => child instanceof THREE.Mesh && !child.userData.isHelper
    ) as THREE.Mesh[];

    for (const child of meshChildren) {
      processMesh(child);
    }
  }

  clearHoverEffect(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh) {
      const outline = this.hoverOutlines.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        this.hoverOutlines.delete(object);
      }
    }
  }

  dispose() {
    // Don't dispose shared materials, let ResourceManager handle it
    this.hoverOutlines.forEach(outline => {
      outline.parent?.remove(outline);
      outline.geometry.dispose();
      (outline.material as THREE.Material).dispose();
    });
    this.hoverOutlines = new WeakMap();
  }
}
