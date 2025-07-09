
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useMouseInteractionState } from './mouse/useMouseInteractionState';
import { useRaycastHandling } from './mouse/useRaycastHandling';
import { useMouseTracking } from './mouse/useMouseTracking';
import type { LoadedModel } from '../types/model';

interface UseMouseInteractionProps {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  targetObject: THREE.Object3D | null;
  scene: THREE.Scene | null;
  onObjectSelect: (object: THREE.Object3D | null, isMultiSelect?: boolean) => void;
  activeTool: string;
  controls: any;
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

export const useMouseInteraction = ({
  renderer,
  camera,
  targetObject,
  scene,
  onObjectSelect,
  activeTool,
  controls,
  onPointCreate,
  onMeasureCreate
}: UseMouseInteractionProps) => {
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const {
    objectData,
    mousePosition,
    isHovering,
    updateObjectData,
    updateMousePosition,
    updateHovering
  } = useMouseInteractionState();

  // Handle mouse move events
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);
    updateMousePosition({ x: event.clientX, y: event.clientY });

    // Raycast for object detection
    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      updateObjectData({
        object: intersect.object,
        point: intersect.point,
        distance: intersect.distance
      });
      updateHovering(true);
    } else {
      updateObjectData(null);
      updateHovering(false);
    }
  }, [renderer, camera, scene, updateObjectData, updateMousePosition, updateHovering]);

  // Handle mouse click events
  const handleMouseClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    
    const intersects = raycasterRef.current.intersectObjects(scene.children, true);
    const isMultiSelect = event.ctrlKey || event.metaKey;

    if (intersects.length > 0) {
      const intersect = intersects[0];
      
      if (activeTool === 'point' && onPointCreate) {
        onPointCreate({
          x: intersect.point.x,
          y: intersect.point.y,
          z: intersect.point.z
        });
      } else if (activeTool === 'select') {
        onObjectSelect(intersect.object, isMultiSelect);
      }
    } else if (activeTool === 'select') {
      onObjectSelect(null, isMultiSelect);
    }
  }, [renderer, camera, scene, activeTool, onObjectSelect, onPointCreate]);

  // Set up event listeners
  useEffect(() => {
    if (!renderer) return;

    const canvas = renderer.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [renderer, handleMouseMove, handleMouseClick]);

  return {
    objectData,
    mousePosition,
    isHovering
  };
};
