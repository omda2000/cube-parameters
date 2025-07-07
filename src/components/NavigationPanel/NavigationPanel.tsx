
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface NavigationPanelProps {
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
}

const NavigationPanel = ({ camera, controls }: NavigationPanelProps) => {
  const handleViewDirection = (direction: string) => {
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
    const duration = 500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosition, newPosition, eased);
      camera.lookAt(controls.target);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const viewButtons = [
    { label: 'Front', key: 'front' },
    { label: 'Back', key: 'back' },
    { label: 'Right', key: 'right' },
    { label: 'Left', key: 'left' },
    { label: 'Top', key: 'top' },
    { label: 'Bottom', key: 'bottom' },
    { label: 'Isometric', key: 'iso' },
  ];

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Navigation</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {viewButtons.map((button) => (
          <Button
            key={button.key}
            variant="outline"
            size="sm"
            onClick={() => handleViewDirection(button.key)}
            className="text-xs"
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NavigationPanel;
