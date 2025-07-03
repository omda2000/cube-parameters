
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const createPointMarker = (position: THREE.Vector3, scene: THREE.Scene) => {
  const geometry = new THREE.SphereGeometry(0.05, 12, 12); // Smaller, more elegant
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xff4444,
    emissive: 0x220000,
    emissiveIntensity: 0.3,
    metalness: 0.1,
    roughness: 0.4
  });
  const point = new THREE.Mesh(geometry, material);
  point.position.copy(position);
  point.userData.isPoint = true;
  point.userData.isHelper = true;
  point.name = `Point_${Date.now()}`;
  scene.add(point);
  return point;
};

export const createMeasurementGroup = (start: THREE.Vector3, end: THREE.Vector3, scene: THREE.Scene) => {
  const measurementGroup = new THREE.Group();
  measurementGroup.userData.isMeasurementGroup = true;
  measurementGroup.userData.isHelper = true;
  measurementGroup.name = `Measurement_${Date.now()}`;

  // Create smaller, more elegant start point
  const startGeometry = new THREE.SphereGeometry(0.04, 12, 12);
  const pointMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    emissive: 0x440000,
    emissiveIntensity: 0.4,
    metalness: 0.2,
    roughness: 0.3
  });
  const startPoint = new THREE.Mesh(startGeometry, pointMaterial);
  startPoint.position.copy(start);
  measurementGroup.add(startPoint);

  // Create smaller, more elegant end point
  const endGeometry = new THREE.SphereGeometry(0.04, 12, 12);
  const endPoint = new THREE.Mesh(endGeometry, pointMaterial.clone());
  endPoint.position.copy(end);
  measurementGroup.add(endPoint);

  // Calculate distance
  const distance = start.distanceTo(end);

  // Create measurement line with better styling
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color: 0xff3333,
    linewidth: 3,
    dashSize: 0.08,
    gapSize: 0.04,
    transparent: true,
    opacity: 0.9
  });
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  measurementGroup.add(line);

  // Create distance label that shows on the line
  const labelDiv = document.createElement('div');
  labelDiv.className = 'measurement-label';
  labelDiv.textContent = `${distance.toFixed(3)}m`;
  labelDiv.style.cssText = `
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', monospace;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #ff3333;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  `;
  
  const label = new CSS2DObject(labelDiv);
  const midPoint = start.clone().add(end).multiplyScalar(0.5);
  // Offset label slightly above the line
  midPoint.y += 0.1;
  label.position.copy(midPoint);
  label.visible = true; // Always visible for better UX
  measurementGroup.add(label);
  measurementGroup.userData.label = label;

  // Store measurement data
  measurementGroup.userData.measurementData = {
    startPoint: start,
    endPoint: end,
    distance: distance
  };

  scene.add(measurementGroup);
  return measurementGroup;
};

export const updatePreviewLine = (
  startPoint: THREE.Vector3, 
  currentPoint: THREE.Vector3, 
  scene: THREE.Scene,
  existingLine?: THREE.Line | null
) => {
  if (existingLine) {
    scene.remove(existingLine);
    existingLine.geometry.dispose();
    (existingLine.material as THREE.Material).dispose();
  }
  
  const points = [startPoint, currentPoint];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({ 
    color: 0x888888,
    linewidth: 2,
    dashSize: 0.04,
    gapSize: 0.02,
    transparent: true,
    opacity: 0.6
  });
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  line.userData.isHelper = true;
  line.name = 'PreviewLine';
  scene.add(line);
  return line;
};

export const clearPreviewLine = (line: THREE.Line | null, scene: THREE.Scene) => {
  if (line) {
    scene.remove(line);
    line.geometry.dispose();
    (line.material as THREE.Material).dispose();
    return null;
  }
  return line;
};
