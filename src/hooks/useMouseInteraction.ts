
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
  onObjectSelect?: (object: THREE.Object3D | null) => void,
  activeTool: 'select' | 'point' | 'measure' | 'move' = 'select',
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const [objectData, setObjectData] = useState<ObjectData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const originalMaterialsRef = useRef<Map<THREE.Object3D, THREE.Material | THREE.Material[]>>(new Map());
  const hoverMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const measureStartPoint = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Create better hover material (outline effect instead of transparency)
    const hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0x331100,
      emissiveIntensity: 0.3,
      transparent: false
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
      if (activeTool !== 'select') return; // Only show hover effect in select mode
      
      const originalMaterials = originalMaterialsRef.current;
      
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
        if (child instanceof THREE.Mesh && !child.userData.isHelper) {
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

    const getIntersectionPoint = (clientX: number, clientY: number): THREE.Vector3 | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const intersectableObjects: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible) {
          intersectableObjects.push(object);
        }
      });

      const intersects = raycaster.intersectObjects(intersectableObjects, true);
      return intersects.length > 0 ? intersects[0].point : null;
    };

    const createPointMarker = (position: THREE.Vector3) => {
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

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      setMousePosition({ x: event.clientX, y: event.clientY });

      // Change cursor based on active tool
      if (activeTool === 'point') {
        renderer.domElement.style.cursor = 'crosshair';
      } else if (activeTool === 'measure') {
        renderer.domElement.style.cursor = 'crosshair';
      } else if (activeTool === 'move') {
        renderer.domElement.style.cursor = 'move';
      } else {
        renderer.domElement.style.cursor = 'default';
      }

      if (activeTool === 'select') {
        raycaster.setFromCamera(mouse, camera);
        
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
            if (hoveredObject) {
              setHoverEffect(hoveredObject, false);
            }
            
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
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      
      const intersectionPoint = getIntersectionPoint(event.clientX, event.clientY);
      
      if (activeTool === 'point' && intersectionPoint) {
        const pointMarker = createPointMarker(intersectionPoint);
        if (onPointCreate) {
          onPointCreate({ 
            x: intersectionPoint.x, 
            y: intersectionPoint.y, 
            z: intersectionPoint.z 
          });
        }
        
        // Auto-select the created point
        if (onObjectSelect) {
          onObjectSelect(pointMarker);
        }
        return;
      }
      
      if (activeTool === 'measure' && intersectionPoint) {
        if (!measureStartPoint.current) {
          // First click - start measurement
          measureStartPoint.current = intersectionPoint.clone();
          createPointMarker(intersectionPoint); // Visual feedback
        } else {
          // Second click - complete measurement
          const startPoint = measureStartPoint.current;
          const endPoint = intersectionPoint;
          
          createPointMarker(endPoint); // Visual feedback
          
          if (onMeasureCreate) {
            onMeasureCreate(startPoint, endPoint);
          }
          
          measureStartPoint.current = null;
        }
        return;
      }
      
      if (activeTool === 'select') {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
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
      }
    };

    const handleMouseLeave = () => {
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
        setHoveredObject(null);
        setObjectData(null);
      }
      renderer.domElement.style.cursor = 'default';
    };

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
      
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
      }
      
      if (hoverMaterialRef.current) {
        hoverMaterialRef.current.dispose();
      }
    };
  }, [renderer, camera, scene, hoveredObject, onObjectSelect, activeTool, onPointCreate, onMeasureCreate]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
