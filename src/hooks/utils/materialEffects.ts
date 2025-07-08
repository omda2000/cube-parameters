
import * as THREE from 'three';

// We'll use outline-only selection to avoid material conflicts
export const applyMaterialOverlay = (
  object: THREE.Object3D, 
  overlayMaterial: THREE.Material,
  originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]>
) => {
  // Removed overlay logic to prevent material conflicts
  // Selection will be handled purely through outlines
  console.log('Selection applied via outline only');
};

export const restoreOriginalMaterials = (
  object: THREE.Object3D,
  originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]>
) => {
  // No material restoration needed since we don't modify materials anymore
  console.log('No material restoration needed');
};
