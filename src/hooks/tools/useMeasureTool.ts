
import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { getIntersectionPoint } from '../utils/raycastUtils';
import { createMeasurementGroup, updatePreviewLine, clearPreviewLine } from '../utils/objectCreators';

export const useMeasureTool = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void,
  onObjectSelect?: (object: THREE.Object3D | null, event?: MouseEvent) => void
) => {
  const measureStartPoint = useRef<THREE.Vector3 | null>(null);
  const previewLineRef = useRef<THREE.Line | null>(null);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    const intersectionPoint = getIntersectionPoint(event.clientX, event.clientY, renderer, camera, scene);
    
    if (intersectionPoint) {
      if (!measureStartPoint.current) {
        // First click - start measurement and show preview line immediately
        measureStartPoint.current = intersectionPoint.clone();
        
        // Create initial preview line (0 length, will be updated on mouse move)
        previewLineRef.current = updatePreviewLine(measureStartPoint.current, measureStartPoint.current, scene, previewLineRef.current);
      } else {
        // Second click - complete measurement
        const startPoint = measureStartPoint.current;
        const endPoint = intersectionPoint;
        
        const measurementGroup = createMeasurementGroup(startPoint, endPoint, scene);
        previewLineRef.current = clearPreviewLine(previewLineRef.current, scene);
        
        if (onMeasureCreate) {
          onMeasureCreate(startPoint, endPoint);
        }
        
        if (onObjectSelect) {
          onObjectSelect(measurementGroup, event);
        }
        
        measureStartPoint.current = null;
      }
    }
  }, [renderer, camera, scene, onMeasureCreate, onObjectSelect]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || !measureStartPoint.current) return;

    const currentPoint = getIntersectionPoint(event.clientX, event.clientY, renderer, camera, scene);
    if (currentPoint) {
      previewLineRef.current = updatePreviewLine(measureStartPoint.current, currentPoint, scene, previewLineRef.current);
    }
  }, [renderer, camera, scene]);

  const handleRightClick = useCallback(() => {
    if (measureStartPoint.current && scene) {
      measureStartPoint.current = null;
      previewLineRef.current = clearPreviewLine(previewLineRef.current, scene);
    }
  }, [scene]);

  const cleanup = useCallback(() => {
    if (scene && previewLineRef.current) {
      previewLineRef.current = clearPreviewLine(previewLineRef.current, scene);
    }
  }, [scene]);

  return { 
    handleClick, 
    handleMouseMove, 
    handleRightClick, 
    cleanup 
  };
};
