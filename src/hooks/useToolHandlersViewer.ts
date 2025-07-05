
import { useMemo } from 'react';
import * as THREE from 'three';

export const useToolHandlersViewer = (
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  // Memoize point creation handler
  const handlePointCreate = useMemo(() => (point: { x: number; y: number; z: number }) => {
    if (onPointCreate) {
      onPointCreate(point);
    }
  }, [onPointCreate]);

  // Memoize measure creation handler
  const handleMeasureCreate = useMemo(() => (start: THREE.Vector3, end: THREE.Vector3) => {
    if (onMeasureCreate) {
      onMeasureCreate(start, end);
    }
  }, [onMeasureCreate]);

  return {
    handlePointCreate,
    handleMeasureCreate
  };
};
