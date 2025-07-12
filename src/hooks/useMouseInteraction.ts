
import { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from './utils/raycastUtils';
import { useHoverEffects } from './useHoverEffects';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null,
  scene: THREE.Scene | null,
  onObjectHover?: (object: THREE.Object3D | null) => void,
  onObjectClick?: (object: THREE.Object3D | null, isMultiSelect?: boolean) => void
) => {
  const lastHoveredObjectRef = useRef<THREE.Object3D | null>(null);
  const { applyHoverEffect } = useHoverEffects();

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);

    const currentHoveredObject = intersects.length > 0 ? intersects[0].object : null;
    const lastHoveredObject = lastHoveredObjectRef.current;

    if (currentHoveredObject !== lastHoveredObject) {
      // Remove hover effect from previously hovered object
      if (lastHoveredObject) {
        applyHoverEffect(lastHoveredObject, false);
      }

      // Apply hover effect to currently hovered object
      if (currentHoveredObject) {
        applyHoverEffect(currentHoveredObject, true);
      }

      lastHoveredObjectRef.current = currentHoveredObject;

      if (onObjectHover) {
        onObjectHover(currentHoveredObject);
      }
    }
  }, [renderer, camera, scene, onObjectHover, applyHoverEffect]);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    event.stopPropagation();
    event.preventDefault();

    const isCtrlClick = event.ctrlKey || event.metaKey;
    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);
    
    if (intersects.length > 0 && onObjectClick) {
      const hitObject = intersects[0].object;
      onObjectClick(hitObject, isCtrlClick);
    } else if (onObjectClick && !isCtrlClick) {
      onObjectClick(null, false);
    }
  }, [renderer, camera, scene, onObjectClick]);

  // Cleanup hover effects when component unmounts
  useEffect(() => {
    return () => {
      if (lastHoveredObjectRef.current) {
        applyHoverEffect(lastHoveredObjectRef.current, false);
      }
    };
  }, [applyHoverEffect]);

  return { handleMouseMove, handleClick };
};
