
import { useRef } from 'react';
import * as THREE from 'three';
import { createSelectionEffects } from '../utils/outlineEffects';

export const useMeshSelection = () => {
  const outlineMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());
  const boundingBoxMapRef = useRef<Map<THREE.Object3D, THREE.LineSegments>>(new Map());

  const applyMeshSelection = (object: THREE.Object3D, selected: boolean) => {
    console.log(`useMeshSelection: ${selected ? 'SELECTING' : 'DESELECTING'} object:`, object.name || object.type);
    const outlineMap = outlineMapRef.current;
    const boundingBoxMap = boundingBoxMapRef.current;

    if (selected) {
      // Create selection effects if not already created for this object
      if (!outlineMap.has(object)) {
        console.log('Creating new selection effects for object:', object.name || object.type);
        const { outline, boundingBox } = createSelectionEffects(object);
        
        if (outline) {
          outlineMap.set(object, outline);
          if (object.parent) {
            object.parent.add(outline);
            console.log('Added outline to parent');
          } else {
            console.warn('No parent found for outline');
          }
        }
        
        if (boundingBox) {
          boundingBoxMap.set(object, boundingBox);
          if (object.parent) {
            object.parent.add(boundingBox);
            console.log('Added bounding box to parent');
          } else {
            console.warn('No parent found for bounding box');
          }
        }
      } else {
        console.log('Selection effects already exist for object:', object.name || object.type);
      }
    } else {
      console.log('Removing selection effects for object:', object.name || object.type);
      
      // Remove outline for this object
      const outline = outlineMap.get(object);
      if (outline) {
        outline.parent?.remove(outline);
        outline.geometry.dispose();
        (outline.material as THREE.Material).dispose();
        outlineMap.delete(object);
        console.log('Removed outline');
      }

      // Remove bounding box for this object
      const boundingBox = boundingBoxMap.get(object);
      if (boundingBox) {
        boundingBox.parent?.remove(boundingBox);
        boundingBox.geometry.dispose();
        (boundingBox.material as THREE.Material).dispose();
        boundingBoxMap.delete(object);
        console.log('Removed bounding box');
      }
    }
  };

  return { applyMeshSelection };
};
