
import * as THREE from 'three';

export const createBlueOutline = (object: THREE.Object3D): THREE.LineSegments | null => {
  if (object instanceof THREE.Mesh) {
    const edges = new THREE.EdgesGeometry(object.geometry);
    // 30mm = 0.03 units (assuming 1 unit = 1 meter)
    const outlineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x0088ff, 
      linewidth: 60, // Increased for 30mm equivalent
      transparent: true,
      opacity: 0.8
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);
    
    // Match the object's transform
    outline.position.copy(object.position);
    outline.rotation.copy(object.rotation);
    outline.scale.copy(object.scale);
    outline.userData.isHelper = true;
    
    return outline;
  }
  return null;
};

export const createPointSelectionEffect = (pointObject: THREE.Object3D): THREE.Mesh | null => {
  if (pointObject instanceof THREE.Mesh) {
    const geometry = new THREE.SphereGeometry(0.12, 16, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x0088ff,
      transparent: true,
      opacity: 0.5,
      depthTest: false
    });
    const outline = new THREE.Mesh(geometry, material);
    outline.position.copy(pointObject.position);
    outline.userData.isHelper = true;
    return outline;
  }
  return null;
};

export const createMeasurementSelectionEffect = (measurementGroup: THREE.Group): THREE.Group => {
  const selectionGroup = new THREE.Group();
  selectionGroup.userData.isHelper = true;

  // Create selection effects for each child
  measurementGroup.children.forEach(child => {
    if (child instanceof THREE.Mesh) {
      // Create larger sphere for points
      const geometry = new THREE.SphereGeometry(0.12, 16, 16);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff,
        transparent: true,
        opacity: 0.5,
        depthTest: false
      });
      const outline = new THREE.Mesh(geometry, material);
      outline.position.copy(child.position);
      selectionGroup.add(outline);
    } else if (child instanceof THREE.Line) {
      // Create thicker blue line for measurement line
      const geometry = child.geometry.clone();
      const material = new THREE.LineDashedMaterial({ 
        color: 0x0088ff,
        linewidth: 5,
        dashSize: 0.1,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.8
      });
      const outline = new THREE.Line(geometry, material);
      outline.computeLineDistances();
      outline.position.copy(child.position);
      outline.rotation.copy(child.rotation);
      outline.scale.copy(child.scale);
      selectionGroup.add(outline);
    }
  });

  return selectionGroup;
};

export const createHoverOutline = (object: THREE.Object3D): THREE.LineSegments | null => {
  if (object instanceof THREE.Mesh) {
    const edges = new THREE.EdgesGeometry(object.geometry);
    const hoverMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffaa00, // Yellow for hover
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const outline = new THREE.LineSegments(edges, hoverMaterial);
    
    // Match the object's transform
    outline.position.copy(object.position);
    outline.rotation.copy(object.rotation);
    outline.scale.copy(object.scale);
    outline.userData.isHelper = true;
    
    return outline;
  }
  return null;
};

export const createBoundingBoxWireframe = (object: THREE.Object3D): THREE.LineSegments | null => {
  if (object instanceof THREE.Mesh) {
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Create box geometry for wireframe
    const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff, // Cyan for bounding box
      linewidth: 1,
      transparent: true,
      opacity: 0.6
    });
    const wireframe = new THREE.LineSegments(edges, wireframeMaterial);
    
    // Position the wireframe at the object's bounding box center
    wireframe.position.copy(center);
    wireframe.userData.isHelper = true;
    
    return wireframe;
  }
  return null;
};

export const createSelectionEffects = (object: THREE.Object3D): { outline: THREE.LineSegments | null; boundingBox: THREE.LineSegments | null } => {
  return {
    outline: createBlueOutline(object),
    boundingBox: createBoundingBoxWireframe(object)
  };
};
