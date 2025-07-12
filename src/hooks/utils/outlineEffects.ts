
import * as THREE from 'three';

export const createBlueOutline = (object: THREE.Object3D): THREE.LineSegments | null => {
  if (object instanceof THREE.Mesh && object.geometry) {
    try {
      const edges = new THREE.EdgesGeometry(object.geometry);
      const outlineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x0088ff, 
        linewidth: 4, // Increased linewidth
        transparent: true,
        opacity: 1.0, // Full opacity for better visibility
        depthTest: false, // Ensure visibility over other objects
        depthWrite: false
      });
      const outline = new THREE.LineSegments(edges, outlineMaterial);
      
      // Match the object's transform
      outline.position.copy(object.position);
      outline.rotation.copy(object.rotation);
      outline.scale.copy(object.scale);
      outline.matrixWorld.copy(object.matrixWorld);
      outline.userData.isHelper = true;
      outline.userData.selectionOutline = true;
      
      // Ensure it renders on top
      outline.renderOrder = 1000;
      
      console.log('Blue outline created successfully');
      return outline;
    } catch (error) {
      console.error('Error creating blue outline:', error);
      return null;
    }
  }
  return null;
};

export const createYellowOutline = (object: THREE.Object3D): THREE.LineSegments | null => {
  if (object instanceof THREE.Mesh && object.geometry) {
    try {
      const edges = new THREE.EdgesGeometry(object.geometry);
      const outlineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffaa00, 
        linewidth: 3, // Increased linewidth
        transparent: true,
        opacity: 0.8, // Increased opacity
        depthTest: false, // Ensure visibility over other objects
        depthWrite: false
      });
      const outline = new THREE.LineSegments(edges, outlineMaterial);
      
      // Match the object's transform
      outline.position.copy(object.position);
      outline.rotation.copy(object.rotation);
      outline.scale.copy(object.scale);
      outline.matrixWorld.copy(object.matrixWorld);
      outline.userData.isHelper = true;
      outline.userData.hoverOutline = true;
      
      // Ensure it renders on top but below selection
      outline.renderOrder = 999;
      
      console.log('Yellow hover outline created successfully');
      return outline;
    } catch (error) {
      console.error('Error creating yellow outline:', error);
      return null;
    }
  }
  return null;
};

export const createBoundingBoxOutline = (object: THREE.Object3D): THREE.LineSegments | null => {
  if (object instanceof THREE.Mesh) {
    try {
      // Calculate bounding box
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // Create box geometry for wireframe
      const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        linewidth: 2, // Increased linewidth
        transparent: true,
        opacity: 0.7, // Increased opacity
        depthTest: false,
        depthWrite: false
      });
      
      const wireframe = new THREE.LineSegments(edges, wireframeMaterial);
      wireframe.position.copy(center);
      wireframe.userData.isHelper = true;
      wireframe.userData.boundingBox = true;
      
      // Render above hover but below selection outline
      wireframe.renderOrder = 998;
      
      console.log('Bounding box outline created successfully');
      return wireframe;
    } catch (error) {
      console.error('Error creating bounding box outline:', error);
      return null;
    }
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
