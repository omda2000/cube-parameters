
import { useState } from 'react';
import * as THREE from 'three';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

export const useMeasurements = () => {
  const [measurements, setMeasurements] = useState<MeasureData[]>([]);

  const addMeasurement = (start: THREE.Vector3, end: THREE.Vector3) => {
    const distance = start.distanceTo(end);
    const newMeasurement: MeasureData = {
      id: `measure_${Date.now()}`,
      startPoint: { x: start.x, y: start.y, z: start.z },
      endPoint: { x: end.x, y: end.y, z: end.z },
      distance,
      label: `Measurement ${measurements.length + 1}`
    };
    
    setMeasurements(prev => [...prev, newMeasurement]);
    return newMeasurement;
  };

  const removeMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const clearAllMeasurements = () => {
    setMeasurements([]);
  };

  const updateMeasurementLabel = (id: string, label: string) => {
    setMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, label } : m)
    );
  };

  return {
    measurements,
    addMeasurement,
    removeMeasurement,
    clearAllMeasurements,
    updateMeasurementLabel
  };
};
