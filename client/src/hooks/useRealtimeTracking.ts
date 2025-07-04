
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RealtimeTrackingProps {
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
}

export const useRealtimeTracking = ({ sceneRef, cameraRef, rendererRef }: RealtimeTrackingProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(100);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateTracking = () => {
      // Update zoom level based on camera position
      if (cameraRef.current) {
        const camera = cameraRef.current;
        const distance = camera.position.length();
        const baseDistance = 10; // Reference distance for 100% zoom
        const calculatedZoom = Math.round((baseDistance / distance) * 100);
        setZoomLevel(Math.max(10, Math.min(1000, calculatedZoom)));
      }

      animationFrameRef.current = requestAnimationFrame(updateTracking);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      
      // Calculate mouse position in normalized device coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Create raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      // Cast ray onto a ground plane at y=0
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersectionPoint);

      if (intersectionPoint) {
        setMousePosition({
          x: intersectionPoint.x,
          y: intersectionPoint.z // Use z as y for 2D coordinates
        });
      }
    };

    // Start tracking
    updateTracking();
    
    // Add mouse move listener
    const canvas = rendererRef.current?.domElement;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [sceneRef, cameraRef, rendererRef]);

  return {
    mousePosition,
    zoomLevel
  };
};
