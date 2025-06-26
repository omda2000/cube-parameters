
import { useState, useRef } from 'react';
import * as THREE from 'three';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
  lineObject?: THREE.Line;
}

export const useMeasurements = () => {
  const [measurements, setMeasurements] = useState<MeasureData[]>([]);
  const lineObjectsRef = useRef<Map<string, THREE.Line>>(new Map());

  const addMeasurement = (start: THREE.Vector3, end: THREE.Vector3, scene?: THREE.Scene) => {
    const distance = start.distanceTo(end);
    const measurementId = `measure_${Date.now()}`;
    
    // Create line geometry for visualization
    let lineObject: THREE.Line | undefined;
    if (scene) {
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x00ff00,
        linewidth: 2
      });
      lineObject = new THREE.Line(geometry, material);
      lineObject.userData.isMeasurementLine = true;
      lineObject.userData.measurementId = measurementId;
      scene.add(lineObject);
      lineObjectsRef.current.set(measurementId, lineObject);
    }
    
    const newMeasurement: MeasureData = {
      id: measurementId,
      startPoint: { x: start.x, y: start.y, z: start.z },
      endPoint: { x: end.x, y: end.y, z: end.z },
      distance,
      label: `Measurement ${measurements.length + 1}`,
      lineObject
    };
    
    setMeasurements(prev => [...prev, newMeasurement]);
    return newMeasurement;
  };

  const removeMeasurement = (id: string) => {
    const lineObject = lineObjectsRef.current.get(id);
    if (lineObject) {
      lineObject.parent?.remove(lineObject);
      lineObject.geometry.dispose();
      if (lineObject.material instanceof THREE.Material) {
        lineObject.material.dispose();
      }
      lineObjectsRef.current.delete(id);
    }
    
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const clearAllMeasurements = () => {
    // Clean up all line objects
    lineObjectsRef.current.forEach((lineObject) => {
      lineObject.parent?.remove(lineObject);
      lineObject.geometry.dispose();
      if (lineObject.material instanceof THREE.Material) {
        lineObject.material.dispose();
      }
    });
    lineObjectsRef.current.clear();
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
