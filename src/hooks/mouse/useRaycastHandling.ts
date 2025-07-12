
import { useCallback } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from '../utils/raycastUtils';
import { EnhancedMaterialManager } from '../utils/enhancedMaterialManager';
import { useHoverEffects } from '../selection/useHoverEffects';

interface UseRaycastHandlingProps {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  hoveredObject: THREE.Object3D | null;
  setHoveredObject: (object: THREE.Object3D | null) => void;
  materialManager: EnhancedMaterialManager | null;
  extractObjectData: (object: THREE.Object3D) => any;
  setObjectData: (data: any) => void;
}

export const useRaycastHandling = ({
  renderer,
  camera,
  scene,
  hoveredObject,
  setHoveredObject,
  materialManager,
  extractObjectData,
  setObjectData
}: UseRaycastHandlingProps) => {
  const { applyHoverEffect } = useHoverEffects();
  const handleRaycastHover = useCallback((clientX: number, clientY: number) => {
    if (!renderer || !camera || !scene || !materialManager) return;

    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);

    let newHoveredObject: THREE.Object3D | null = null;

    if (intersects.length > 0) {
      newHoveredObject = intersects[0].object;
      
      // If clicked on a child of a measurement group, hover the group
      if (newHoveredObject.parent && newHoveredObject.parent.userData.isMeasurementGroup) {
        newHoveredObject = newHoveredObject.parent;
      }
    }

    // Update hover state only if it changed
    if (newHoveredObject !== hoveredObject) {
      // Remove hover from previous object
      if (hoveredObject) {
        materialManager.setHoverEffect(hoveredObject, false);
        applyHoverEffect(hoveredObject, false);
        setObjectData(null);
      }

      // Add hover to new object
      if (newHoveredObject) {
        materialManager.setHoverEffect(newHoveredObject, true);
        applyHoverEffect(newHoveredObject, true);
        const data = extractObjectData(newHoveredObject);
        setObjectData(data);
      }

      setHoveredObject(newHoveredObject);
    }
  }, [renderer, camera, scene, hoveredObject, setHoveredObject, materialManager, extractObjectData, setObjectData, applyHoverEffect]);

  return { handleRaycastHover };
};
