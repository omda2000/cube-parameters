
import { useRef, useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from './utils/raycastUtils';
import { useHoverEffects } from './useHoverEffects';
import { useObjectData } from './mouse/useObjectData';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void,
  activeTool: 'select' | 'point' | 'measure' | 'move' = 'select',
  controls?: any,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  const lastHoveredObjectRef = useRef<THREE.Object3D | null>(null);
  const isMountedRef = useRef(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const { applyHoverEffect, cleanupHoverEffects } = useHoverEffects();
  const { objectData, setObjectData, extractObjectData } = useObjectData();

  // Track mounting state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    try {
      if (!renderer || !camera || !scene || !isMountedRef.current) return;

      // Update mouse position safely
      if (isMountedRef.current) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }

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
        if (currentHoveredObject && isMountedRef.current) {
          applyHoverEffect(currentHoveredObject, true);
          const extractedData = extractObjectData(currentHoveredObject);
          setObjectData(extractedData);
          setIsHovering(true);
          console.log('Hovering object:', currentHoveredObject.name || currentHoveredObject.type);
        } else if (isMountedRef.current) {
          setObjectData(null);
          setIsHovering(false);
        }

        lastHoveredObjectRef.current = currentHoveredObject;
      }
    } catch (error) {
      console.error('Error in handleMouseMove:', error);
    }
  }, [renderer, camera, scene, applyHoverEffect, setObjectData, extractObjectData]);

  const handleClick = useCallback((event: MouseEvent) => {
    try {
      if (!renderer || !camera || !scene || event.button !== 0 || !isMountedRef.current) return;

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
      
      if (intersects.length > 0 && onObjectSelect) {
        const hitObject = intersects[0].object;
        console.log('Object selected:', hitObject.name || hitObject.type);
        onObjectSelect(hitObject);
      } else if (onObjectSelect && !isCtrlClick) {
        console.log('Selection cleared');
        onObjectSelect(null);
      }
    } catch (error) {
      console.error('Error in handleClick:', error);
    }
  }, [renderer, camera, scene, onObjectSelect]);

  // Cleanup hover effects when component unmounts
  useEffect(() => {
    return () => {
      cleanupHoverEffects();
      isMountedRef.current = false;
    };
  }, [cleanupHoverEffects]);

  return { 
    handleMouseMove, 
    handleClick, 
    objectData, 
    mousePosition, 
    isHovering 
  };
};
