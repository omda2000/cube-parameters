import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const createPointMarker = (position: THREE.Vector3, scene: THREE.Scene) => {
  const geometry = new THREE.SphereGeometry(0.1, 16, 16);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xff4444,
    emissive: 0x220000,
    emissiveIntensity: 0.2
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

  // Create start point
  const startGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const pointMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    emissive: 0x220000,
    emissiveIntensity: 0.2
  });
  const startPoint = new THREE.Mesh(startGeometry, pointMaterial);
  startPoint.position.copy(start);
  measurementGroup.add(startPoint);

  // Create end point
  const endGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const endPoint = new THREE.Mesh(endGeometry, pointMaterial.clone());
  endPoint.position.copy(end);
  measurementGroup.add(endPoint);

  // Calculate distance
  const distance = start.distanceTo(end);

  // Create thick red dashed line (0.3mm equivalent)
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color: 0xff0000,
    linewidth: 5, // Thick line
    dashSize: 0.1,
    gapSize: 0.05
  });
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  measurementGroup.add(line);

  // Create measurement label (hidden by default)
  const labelDiv = document.createElement('div');
  labelDiv.className = 'measurement-label';
  labelDiv.textContent = `${distance.toFixed(2)}m`;
  labelDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
  labelDiv.style.color = 'white';
  labelDiv.style.fontSize = '12px';
  labelDiv.style.padding = '2px 4px';
  labelDiv.style.borderRadius = '4px';
  labelDiv.style.pointerEvents = 'none';
  const label = new CSS2DObject(labelDiv);
  label.position.copy(start.clone().add(end).multiplyScalar(0.5));
  label.visible = false;
  measurementGroup.add(label);
  measurementGroup.userData.label = label;

  // Store measurement data (using the already calculated distance)
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
    dashSize: 0.05,
    gapSize: 0.025,
    transparent: true,
    opacity: 0.5
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
