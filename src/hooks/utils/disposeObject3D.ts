import * as THREE from 'three';

export const disposeObject3D = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => mat.dispose());
      } else if (child.material) {
        (child.material as THREE.Material).dispose();
      }
    } else if (child instanceof THREE.Line) {
      child.geometry?.dispose();
      (child.material as THREE.Material)?.dispose();
    }
  });
};
