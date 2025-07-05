
import * as THREE from 'three';

export class SelectionMaterials {
  private overlayMaterial: THREE.MeshStandardMaterial | null = null;

  getOverlayMaterial(): THREE.MeshStandardMaterial {
    if (!this.overlayMaterial) {
      this.overlayMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3,
        depthTest: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
    }
    return this.overlayMaterial;
  }

  dispose() {
    if (this.overlayMaterial) {
      this.overlayMaterial.dispose();
      this.overlayMaterial = null;
    }
  }
}
