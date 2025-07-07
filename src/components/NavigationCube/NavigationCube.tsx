
import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface NavigationCubeProps {
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
  size?: number;
}

const NavigationCube = ({ camera, controls, size = 100 }: NavigationCubeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeFace, setActiveFace] = useState<string | null>(null);

  const handleFaceClick = useCallback((direction: string) => {
    if (!camera || !controls) return;

    const distance = camera.position.distanceTo(controls.target);
    const newPosition = new THREE.Vector3();

    switch (direction) {
      case 'front':
        newPosition.set(0, 0, distance);
        break;
      case 'back':
        newPosition.set(0, 0, -distance);
        break;
      case 'right':
        newPosition.set(distance, 0, 0);
        break;
      case 'left':
        newPosition.set(-distance, 0, 0);
        break;
      case 'top':
        newPosition.set(0, distance, 0);
        break;
      case 'bottom':
        newPosition.set(0, -distance, 0);
        break;
      case 'iso':
        newPosition.set(distance * 0.7, distance * 0.7, distance * 0.7);
        break;
    }

    newPosition.add(controls.target);
    
    // Smooth transition
    const startPosition = camera.position.clone();
    const startTime = Date.now();
    const duration = 500; // ms

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out

      camera.position.lerpVectors(startPosition, newPosition, eased);
      camera.lookAt(controls.target);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    setActiveFace(direction);
    setTimeout(() => setActiveFace(null), 300);
  }, [camera, controls]);

  const faces = [
    { name: 'Front', key: 'front', style: 'top-[30%] left-[30%]', label: 'F' },
    { name: 'Back', key: 'back', style: 'top-[30%] right-[10%]', label: 'B' },
    { name: 'Right', key: 'right', style: 'top-[30%] right-[30%]', label: 'R' },
    { name: 'Left', key: 'left', style: 'top-[30%] left-[10%]', label: 'L' },
    { name: 'Top', key: 'top', style: 'top-[10%] left-[30%]', label: 'T' },
    { name: 'Bottom', key: 'bottom', style: 'bottom-[10%] left-[30%]', label: 'B' },
    { name: 'Isometric', key: 'iso', style: 'top-[10%] right-[10%]', label: 'ISO' },
  ];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-200 ${
        isHovered ? 'scale-110' : 'scale-100'
      }`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cube container */}
      <div className="relative w-full h-full bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        {/* Corner lines to make it look like a cube */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d="M20,20 L80,20 L80,80 L20,80 Z M30,10 L90,10 L90,70 L80,80 M20,20 L30,10 M80,20 L90,10 M80,80 L90,70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border opacity-50"
            />
          </svg>
        </div>

        {/* Navigation faces */}
        {faces.map((face) => (
          <button
            key={face.key}
            onClick={() => handleFaceClick(face.key)}
            className={`absolute w-6 h-6 flex items-center justify-center text-xs font-bold rounded transition-all duration-150 ${
              activeFace === face.key
                ? 'bg-primary text-primary-foreground scale-110'
                : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground hover:scale-105'
            } ${face.style}`}
            title={face.name}
          >
            {face.label}
          </button>
        ))}

        {/* Center home button */}
        <button
          onClick={() => handleFaceClick('iso')}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:scale-105 transition-transform"
          title="Home View"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.5L1.5 12h2v5.5h4v-4h4v4h4V12h2L10 3.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NavigationCube;
