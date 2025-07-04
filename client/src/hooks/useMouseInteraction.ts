
import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MaterialManager } from './utils/materialManager';
import { createRaycaster, getIntersectableObjects, invalidateIntersectableCache } from './utils/raycastUtils';
import { useSelectTool } from './tools/useSelectTool';
import { usePointTool } from './tools/usePointTool';
import { useMeasureTool } from './tools/useMeasureTool';
import { useMoveTool } from './tools/useMoveTool';

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
  controls?: OrbitControls | null,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const [objectData, setObjectData] = useState<ObjectData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const materialManagerRef = useRef<MaterialManager | null>(null);
  const isInitializedRef = useRef(false);

  console.log('useMouseInteraction: Initializing with', { 
    hasRenderer: !!renderer, 
    hasCamera: !!camera, 
    hasScene: !!scene,
    activeTool 
  });

  // Initialize tools with proper error handling
  const selectTool = useSelectTool(renderer, camera, scene, onObjectSelect);
  const pointTool = usePointTool(renderer, camera, scene, onPointCreate, onObjectSelect);
  const measureTool = useMeasureTool(renderer, camera, scene, onMeasureCreate, onObjectSelect);
  const moveTool = useMoveTool(renderer, camera, scene, controls || null, onObjectSelect);

  // Memoize object data extraction to avoid recalculation
  const extractObjectData = useCallback((object: THREE.Object3D): ObjectData => {
    try {
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
    } catch (error) {
      console.error('Error extracting object data:', error);
      return {
        name: 'Unknown Object',
        type: 'unknown',
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        scale: new THREE.Vector3(1, 1, 1),
        visible: true
      };
    }
  }, []);

  // Throttle mouse move to improve performance
  const throttledMouseMove = useCallback((callback: (event: MouseEvent) => void) => {
    let isThrottled = false;
    return (event: MouseEvent) => {
      if (!isThrottled) {
        callback(event);
        isThrottled = true;
        requestAnimationFrame(() => {
          isThrottled = false;
        });
      }
    };
  }, []);

  useEffect(() => {
    console.log('useMouseInteraction: Effect triggered', { 
      hasRenderer: !!renderer, 
      hasCamera: !!camera, 
      hasScene: !!scene,
      isInitialized: isInitializedRef.current
    });

    // Early return if critical dependencies are missing
    if (!renderer || !camera || !scene) {
      console.warn('useMouseInteraction: Missing critical dependencies');
      return;
    }

    // Prevent multiple initializations
    if (isInitializedRef.current) {
      console.log('useMouseInteraction: Already initialized, skipping');
      return;
    }

    try {
      // Initialize MaterialManager with error handling
      if (!materialManagerRef.current) {
        materialManagerRef.current = new MaterialManager();
        console.log('useMouseInteraction: MaterialManager initialized');
      }

      const performRaycast = (x: number, y: number) => {
        try {
          if (!renderer || !camera || !scene) return;

          const { raycaster, mouse, dispose } = createRaycaster();
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersectableObjects = getIntersectableObjects(scene);
          const intersects = raycaster.intersectObjects(intersectableObjects, true);

          if (intersects.length > 0) {
            const newHoveredObject = intersects[0].object;

            if (hoveredObject !== newHoveredObject) {
              if (hoveredObject && materialManagerRef.current) {
                materialManagerRef.current.setHoverEffect(hoveredObject, false);
              }

              if (materialManagerRef.current) {
                materialManagerRef.current.setHoverEffect(newHoveredObject, true);
              }
              setHoveredObject(newHoveredObject);
              setObjectData(extractObjectData(newHoveredObject));
            }
          } else {
            if (hoveredObject && materialManagerRef.current) {
              materialManagerRef.current.setHoverEffect(hoveredObject, false);
              setHoveredObject(null);
              setObjectData(null);
            }
          }

          dispose();
        } catch (error) {
          console.error('Error in performRaycast:', error);
        }
      };

      const handleMouseMove = throttledMouseMove((event: MouseEvent) => {
        try {
          if (!renderer || !camera || !scene) return;

          performRaycast(event.clientX, event.clientY);

          const pos = { x: event.clientX, y: event.clientY };
          setMousePosition(pos);
          mousePositionRef.current = pos;

          // Update cursor based on active tool
          const cursors = {
            point: 'crosshair',
            measure: 'crosshair',
            move: 'move',
            select: 'default'
          };
          renderer.domElement.style.cursor = cursors[activeTool];

          // Handle measure tool preview
          if (activeTool === 'measure') {
            measureTool.handleMouseMove(event);
          }

          // Handle hover effects for select tool
          if (activeTool === 'select') {
            performRaycast(event.clientX, event.clientY);
          }
        } catch (error) {
          console.error('Error in handleMouseMove:', error);
        }
      });

      const updateHover = () => {
        try {
          if (activeTool !== 'select' || !renderer || !camera || !scene) return;
          performRaycast(mousePositionRef.current.x, mousePositionRef.current.y);
        } catch (error) {
          console.error('Error in updateHover:', error);
        }
      };

      const handleClick = (event: MouseEvent) => {
        try {
          // Clear any existing hover effects before selection
          if (hoveredObject && materialManagerRef.current) {
            materialManagerRef.current.setHoverEffect(hoveredObject, false);
            setHoveredObject(null);
          }

          switch (activeTool) {
            case 'select':
              selectTool.handleClick(event);
              break;
            case 'point':
              pointTool.handleClick(event);
              break;
            case 'measure':
              measureTool.handleClick(event);
              break;
            case 'move':
              moveTool.handleClick(event);
              break;
          }
        } catch (error) {
          console.error('Error in handleClick:', error);
        }
      };

      const handleMouseLeave = () => {
        try {
          if (hoveredObject && materialManagerRef.current) {
            materialManagerRef.current.setHoverEffect(hoveredObject, false);
            setHoveredObject(null);
            setObjectData(null);
          }
          measureTool.cleanup();
          moveTool.cleanup();
          if (renderer?.domElement) {
            renderer.domElement.style.cursor = 'default';
          }
        } catch (error) {
          console.error('Error in handleMouseLeave:', error);
        }
      };

      const handleContextMenu = (event: MouseEvent) => {
        try {
          event.preventDefault();
          measureTool.handleRightClick();
        } catch (error) {
          console.error('Error in handleContextMenu:', error);
        }
      };

      // Add event listeners with error handling
      const domElement = renderer.domElement;
      if (domElement) {
        domElement.addEventListener('mousemove', handleMouseMove);
        domElement.addEventListener('click', handleClick);
        domElement.addEventListener('mouseleave', handleMouseLeave);
        domElement.addEventListener('contextmenu', handleContextMenu);
        
        if (controls) {
          controls.addEventListener('change', updateHover);
        }

        isInitializedRef.current = true;
        console.log('useMouseInteraction: Event listeners added successfully');
      }

      return () => {
        console.log('useMouseInteraction: Cleaning up');
        try {
          if (domElement) {
            domElement.removeEventListener('mousemove', handleMouseMove);
            domElement.removeEventListener('click', handleClick);
            domElement.removeEventListener('mouseleave', handleMouseLeave);
            domElement.removeEventListener('contextmenu', handleContextMenu);
          }
          
          if (controls) {
            controls.removeEventListener('change', updateHover);
          }
          
          if (hoveredObject && materialManagerRef.current) {
            materialManagerRef.current.setHoverEffect(hoveredObject, false);
          }
          
          measureTool.cleanup();
          moveTool.cleanup();
          
          if (materialManagerRef.current) {
            materialManagerRef.current.dispose();
            materialManagerRef.current = null;
          }

          isInitializedRef.current = false;
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      };
    } catch (error) {
      console.error('Critical error in useMouseInteraction setup:', error);
      return () => {
        isInitializedRef.current = false;
      };
    }
  }, [renderer, camera, scene, hoveredObject, activeTool, controls, selectTool, pointTool, measureTool, moveTool, onObjectSelect, onPointCreate, onMeasureCreate, extractObjectData, throttledMouseMove]);

  // Invalidate intersection cache when scene changes
  useEffect(() => {
    if (scene) {
      invalidateIntersectableCache();
    }
  }, [scene, targetObject]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
