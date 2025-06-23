
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
  objectName: string,
  showEdges: boolean
) => {
  const boxRef = useRef<THREE.Mesh | null>(null);
  const edgesRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    if (!scene) return;

    // Box setup
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    const material = new THREE.MeshPhongMaterial({
      color: boxColor,
      flatShading: true,
    });
    const box = new THREE.Mesh(geometry, material);
    boxRef.current = box;
    box.castShadow = true;
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
    const nameLabel = new CSS2DObject(nameDiv);
    nameLabel.position.set(0, 1, 0);
    box.add(nameLabel);

    // Edges setup
    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lineSegments = new THREE.LineSegments(edges, edgesMaterial);
    edgesRef.current = lineSegments;
    lineSegments.visible = showEdges;
    scene.add(lineSegments);

    return () => {
      if (box) {
        scene.remove(box);
        geometry.dispose();
        material.dispose();
      }
      if (lineSegments) {
        scene.remove(lineSegments);
        edges.dispose();
        edgesMaterial.dispose();
      }
    };
  }, [scene]);

  // Update box dimensions and edges
  useEffect(() => {
    if (!boxRef.current || !edgesRef.current) return;
    
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    boxRef.current.geometry.dispose();
    boxRef.current.geometry = geometry;

    const edges = new THREE.EdgesGeometry(geometry);
    edgesRef.current.geometry.dispose();
    edgesRef.current.geometry = edges;
  }, [dimensions]);

  // Update edges visibility
  useEffect(() => {
    if (!edgesRef.current) return;
    edgesRef.current.visible = showEdges;
  }, [showEdges]);

  // Update box color
  useEffect(() => {
    if (!boxRef.current) return;
    (boxRef.current.material as THREE.MeshPhongMaterial).color.set(boxColor);
  }, [boxColor]);

  return { boxRef, edgesRef };
};
