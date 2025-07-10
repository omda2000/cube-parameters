import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useBoxMesh = (
  scene: THREE.Scene | null,
  dimensions: { length: number; width: number; height: number },
  color: string,
  name: string,
  visible: boolean = true,
  enabled: boolean = true
) => {
  const boxRef = useRef<THREE.Mesh | null>(null);
  const labelRef = useRef<CSS2DObject | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!scene || isInitialized.current || !enabled) return;

    // Create box geometry
    const geometry = new THREE.BoxGeometry(dimensions.length, dimensions.height, dimensions.width);
    const material = new THREE.MeshPhongMaterial({ color });
    const box = new THREE.Mesh(geometry, material);
    
    box.castShadow = true;
    box.receiveShadow = true;
    box.visible = visible;
    boxRef.current = box;

    // Create label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = name;
    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    labelDiv.style.color = 'white';
    labelDiv.style.fontSize = '12px';
    labelDiv.style.padding = '4px 8px';
    labelDiv.style.borderRadius = '4px';
    labelDiv.style.pointerEvents = 'none';

    const label = new CSS2DObject(labelDiv);
    label.position.set(0, dimensions.height / 2 + 0.5, 0);
    label.visible = visible;
    box.add(label);
    labelRef.current = label;

    scene.add(box);
    isInitialized.current = true;

    return () => {
      if (scene && box) {
        scene.remove(box);
        geometry.dispose();
        material.dispose();
      }
      isInitialized.current = false;
    };
  }, [scene, enabled]);

  // Update dimensions, color, and name only if enabled
  useEffect(() => {
    if (!boxRef.current || !enabled) return;
    
    const box = boxRef.current;
    const geometry = box.geometry as THREE.BoxGeometry;
    const material = box.material as THREE.MeshPhongMaterial;
    
    // Update geometry
    geometry.dispose();
    const newGeometry = new THREE.BoxGeometry(dimensions.length, dimensions.height, dimensions.width);
    box.geometry = newGeometry;
    
    // Update material color
    material.color.set(color);
    
    // Update label
    if (labelRef.current) {
      const labelDiv = labelRef.current.element as HTMLElement;
      labelDiv.textContent = name;
      labelRef.current.position.set(0, dimensions.height / 2 + 0.5, 0);
    }
  }, [dimensions.length, dimensions.width, dimensions.height, color, name, enabled]);

  // Update visibility when it changes
  useEffect(() => {
    if (!enabled) return;
    
    if (boxRef.current) {
      boxRef.current.visible = visible;
    }
    if (labelRef.current) {
      labelRef.current.visible = visible;
    }
  }, [visible, enabled]);

  return { boxRef };
};
