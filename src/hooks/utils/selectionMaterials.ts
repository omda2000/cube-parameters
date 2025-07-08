
import * as THREE from 'three';

export class SelectionMaterials {
  private outlineMaterial: THREE.LineBasicMaterial | null = null;

  getOutlineMaterial(): THREE.LineBasicMaterial {
    if (!this.outlineMaterial) {
      this.outlineMaterial = new THREE.LineBasicMaterial({
        color: 0x0088ff, // Blue outline instead of red overlay
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
        depthTest: false,
        depthWrite: false
      });
    }
    return this.outlineMaterial;
  }

  dispose() {
    if (this.outlineMaterial) {
      this.outlineMaterial.dispose();
      this.outlineMaterial = null;
    }
  }
}
