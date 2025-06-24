
import { useEffect, useState, useRef } from 'react';
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
  const originalMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const hoverMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Create hover material once
    const hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.7,
      emissive: 0x332211,
      emissiveIntensity: 0.3
    });
    hoverMaterialRef.current = hoverMaterial;

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
      const originalMaterials = originalMaterialsRef.current;
      
      if (object instanceof THREE.Mesh) {
        if (hover) {
          // Store original material if not already stored
          if (!originalMaterials.has(object)) {
            originalMaterials.set(object, object.material);
          }
          object.material = hoverMaterial;
        } else {
          // Restore original material
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
      
      // Get all intersectable objects
      const intersectableObjects: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible && !object.userData.isHelper) {
          intersectableObjects.push(object);
        }
      });

      const intersects = raycaster.intersectObjects(intersectableObjects, true);
      
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
      if (event.button !== 0) return; // Only handle left clicks
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      // Get all intersectable objects
      const intersectableObjects: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible && !object.userData.isHelper) {
          intersectableObjects.push(object);
        }
      });

      const intersects = raycaster.intersectObjects(intersectableObjects, true);
      
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

    // Add context menu prevention to avoid browser context menu
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      
      // Clean up hover effects
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
      }
      
      // Clean up materials
      if (hoverMaterialRef.current) {
        hoverMaterialRef.current.dispose();
      }
    };
  }, [renderer, camera, scene, hoveredObject, onObjectSelect]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
