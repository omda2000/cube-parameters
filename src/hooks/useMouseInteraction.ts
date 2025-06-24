
import { useEffect, useState } from 'react';
import * as THREE from 'three';

interface ObjectData {
  name: string;
  type: string;
  vertices?: number;
  triangles?: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
}

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void
) => {
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const [objectData, setObjectData] = useState<ObjectData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [originalMaterials, setOriginalMaterials] = useState<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5
    });

    const extractObjectData = (object: THREE.Object3D): ObjectData => {
      let vertices = 0;
      let triangles = 0;

      if (object instanceof THREE.Mesh && object.geometry) {
        const geometry = object.geometry;
        if (geometry.attributes.position) {
          vertices = geometry.attributes.position.count;
        }
        if (geometry.index) {
          triangles = geometry.index.count / 3;
        } else {
          triangles = vertices / 3;
        }
      }

      return {
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.type,
        vertices: vertices > 0 ? vertices : undefined,
        triangles: triangles > 0 ? Math.floor(triangles) : undefined,
        position: object.position.clone(),
        rotation: object.rotation.clone(),
        scale: object.scale.clone(),
        visible: object.visible
      };
    };

    const setHoverEffect = (object: THREE.Object3D, hover: boolean) => {
      if (object instanceof THREE.Mesh) {
        if (hover) {
          if (!originalMaterials.has(object)) {
            originalMaterials.set(object, object.material);
          }
          object.material = hoverMaterial;
        } else {
          const originalMaterial = originalMaterials.get(object);
          if (originalMaterial) {
            object.material = originalMaterial;
            originalMaterials.delete(object);
          }
        }
      }

      // Apply to children recursively
      object.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          if (hover) {
            if (!originalMaterials.has(child)) {
              originalMaterials.set(child, child.material);
            }
            child.material = hoverMaterial;
          } else {
            const originalMaterial = originalMaterials.get(child);
            if (originalMaterial) {
              child.material = originalMaterial;
              originalMaterials.delete(child);
            }
          }
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      setMousePosition({ x: event.clientX, y: event.clientY });

      raycaster.setFromCamera(mouse, camera);
      
      // Get all objects in the scene for intersection
      const intersectableObjects: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible) {
          intersectableObjects.push(object);
        }
      });

      const intersects = raycaster.intersectObjects(intersectableObjects, false);
      
      if (intersects.length > 0) {
        const newHoveredObject = intersects[0].object;
        
        if (hoveredObject !== newHoveredObject) {
          // Remove hover effect from previous object
          if (hoveredObject) {
            setHoverEffect(hoveredObject, false);
          }
          
          // Apply hover effect to new object
          setHoverEffect(newHoveredObject, true);
          setHoveredObject(newHoveredObject);
          setObjectData(extractObjectData(newHoveredObject));
        }
      } else {
        if (hoveredObject) {
          setHoverEffect(hoveredObject, false);
          setHoveredObject(null);
          setObjectData(null);
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      // Get all objects in the scene for intersection
      const intersectableObjects: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible) {
          intersectableObjects.push(object);
        }
      });

      const intersects = raycaster.intersectObjects(intersectableObjects, false);
      
      if (intersects.length > 0 && onObjectSelect) {
        onObjectSelect(intersects[0].object);
      } else if (onObjectSelect) {
        onObjectSelect(null);
      }
    };

    const handleMouseLeave = () => {
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
        setHoveredObject(null);
        setObjectData(null);
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      
      // Clean up hover effects
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
      }
      
      hoverMaterial.dispose();
    };
  }, [renderer, camera, scene, hoveredObject, originalMaterials, onObjectSelect]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
