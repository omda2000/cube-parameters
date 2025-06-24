
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export const useBoxMesh = (
  scene: THREE.Scene | null,
  dimensions: Dimensions,
  boxColor: string,
  objectName: string
) => {
  const boxRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!scene) return;

    // Box setup
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    const material = new THREE.MeshStandardMaterial({
      color: boxColor,
    });
    const box = new THREE.Mesh(geometry, material);
    boxRef.current = box;
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(0, 0, 0);
    scene.add(box);

    // Name label
    const nameDiv = document.createElement('div');
    nameDiv.className = 'label';
    nameDiv.textContent = objectName;
    nameDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    nameDiv.style.color = 'white';
    nameDiv.style.padding = '2px 5px';
    nameDiv.style.borderRadius = '3px';
    nameDiv.style.visibility = 'hidden';
    nameDiv.style.fontSize = '12px';
    const nameLabel = new CSS2DObject(nameDiv);
    nameLabel.position.set(0, dimensions.height / 2 + 0.2, 0);
    box.add(nameLabel);

    return () => {
      if (box) {
        scene.remove(box);
        geometry.dispose();
        material.dispose();
      }
    };
  }, [scene]);

  // Update box dimensions
  useEffect(() => {
    if (!boxRef.current) return;
    
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    boxRef.current.geometry.dispose();
    boxRef.current.geometry = geometry;

    // Update label position
    const nameLabel = boxRef.current.children.find(child => child instanceof CSS2DObject) as CSS2DObject;
    if (nameLabel) {
      nameLabel.position.set(0, dimensions.height / 2 + 0.2, 0);
    }
  }, [dimensions]);

  // Update box color
  useEffect(() => {
    if (!boxRef.current) return;
    (boxRef.current.material as THREE.MeshStandardMaterial).color.set(boxColor);
  }, [boxColor]);

  // Update object name
  useEffect(() => {
    if (!boxRef.current) return;
    const nameLabel = boxRef.current.children.find(child => child instanceof CSS2DObject) as CSS2DObject;
    if (nameLabel && nameLabel.element) {
      nameLabel.element.textContent = objectName;
    }
  }, [objectName]);

  return { boxRef };
};
