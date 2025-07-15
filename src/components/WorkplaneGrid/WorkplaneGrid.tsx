import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface WorkplaneGridProps {
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  size?: number;
  visible?: boolean;
}

export const WorkplaneGrid: React.FC<WorkplaneGridProps> = ({ 
  scene, 
  camera, 
  size = 20, 
  visible = true 
}) => {
  const workplaneGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Custom shader material for adaptive grid
  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uSize: { value: size },
        uCameraPosition: { value: new THREE.Vector3() },
        uCameraZoom: { value: 1.0 },
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uSize;
        uniform vec3 uCameraPosition;
        uniform float uCameraZoom;
        
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        void main() {
          // Calculate distance from camera for adaptive fading
          float dist = distance(uCameraPosition, vWorldPosition);
          float zoomFactor = uCameraZoom;
          
          // Convert UV to world coordinates
          vec2 worldPos = (vUv - 0.5) * uSize;
          
          // Major grid (1cm spacing)
          vec2 majorGrid = abs(fract(worldPos) - 0.5);
          float majorLine = min(majorGrid.x, majorGrid.y);
          float majorMask = 1.0 - smoothstep(0.0, 0.02, majorLine);
          
          // Minor grid (0.5cm spacing)
          vec2 minorGrid = abs(fract(worldPos * 2.0) - 0.5);
          float minorLine = min(minorGrid.x, minorGrid.y);
          float minorMask = 1.0 - smoothstep(0.0, 0.01, minorLine);
          
          // Adaptive fading based on zoom
          float majorOpacity = 0.6 * smoothstep(0.1, 1.0, zoomFactor);
          float minorOpacity = 0.3 * smoothstep(0.3, 1.0, zoomFactor);
          
          // Grid line colors
          vec3 majorColor = vec3(0.69, 0.855, 0.882); // rgba(176, 218, 225, 0.6)
          vec3 minorColor = vec3(0.69, 0.855, 0.882); // rgba(176, 218, 225, 0.3)
          
          // Base plane color
          vec3 baseColor = vec3(0.878, 0.969, 0.980); // rgba(224, 247, 250, 0.4)
          
          // Combine colors
          vec3 finalColor = baseColor;
          finalColor = mix(finalColor, minorColor, minorMask * minorOpacity);
          finalColor = mix(finalColor, majorColor, majorMask * majorOpacity);
          
          // Border effect
          vec2 borderDist = min(vUv, 1.0 - vUv);
          float border = min(borderDist.x, borderDist.y);
          float borderMask = 1.0 - smoothstep(0.0, 0.02, border);
          vec3 borderColor = vec3(0.678, 0.910, 0.957); // #ADE8F4
          finalColor = mix(finalColor, borderColor, borderMask * 0.8);
          
          float alpha = 0.4 + majorMask * majorOpacity * 0.2 + minorMask * minorOpacity * 0.1;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    });
  }, [size]);

  // Text sprites for corner labels
  const createTextSprite = (text: string, fontSize: number, color: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 128;
    
    context.font = `${fontSize}px sans-serif`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    // Scale sprite appropriately
    sprite.scale.set(2, 0.5, 1);
    
    return sprite;
  };

  useEffect(() => {
    if (!scene) return;

    // Create workplane group
    const workplaneGroup = new THREE.Group();
    workplaneGroup.userData.isHelper = true;
    workplaneGroupRef.current = workplaneGroup;

    // Create the main workplane geometry
    const planeGeometry = new THREE.PlaneGeometry(size, size, 1, 1);
    const planeMesh = new THREE.Mesh(planeGeometry, gridMaterial);
    planeMesh.rotation.x = -Math.PI / 2; // Lay flat on XZ plane
    planeMesh.position.y = -0.001; // Slightly below zero to avoid z-fighting
    
    // Store reference to material for updates
    materialRef.current = gridMaterial;

    // Create corner labels
    const workplaneLabel = createTextSprite('Workplane', 24, '#80C9D0');
    workplaneLabel.position.set(-size * 0.4, 0.1, size * 0.4);
    
    const unitsLabel = createTextSprite('Centimeters', 12, '#B0DAE1');
    unitsLabel.position.set(size * 0.4, 0.1, -size * 0.4);

    // Add elements to group
    workplaneGroup.add(planeMesh);
    workplaneGroup.add(workplaneLabel);
    workplaneGroup.add(unitsLabel);

    // Add to scene
    scene.add(workplaneGroup);

    return () => {
      if (scene && workplaneGroup) {
        scene.remove(workplaneGroup);
        // Dispose of geometries and materials
        workplaneGroup.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [scene, size, gridMaterial]);

  // Update shader uniforms based on camera
  useEffect(() => {
    if (!materialRef.current || !camera) return;

    const updateUniforms = () => {
      if (materialRef.current && camera) {
        materialRef.current.uniforms.uCameraPosition.value.copy(camera.position);
        
        // Calculate zoom factor based on camera type and position
        let zoomFactor = 1.0;
        if (camera instanceof THREE.PerspectiveCamera) {
          zoomFactor = 1.0 / (camera.position.length() / 10);
        } else if (camera instanceof THREE.OrthographicCamera) {
          zoomFactor = 1.0 / camera.zoom;
        }
        
        materialRef.current.uniforms.uCameraZoom.value = Math.max(0.1, Math.min(2.0, zoomFactor));
      }
    };

    updateUniforms();
    
    // Set up animation loop for continuous updates
    const animate = () => {
      updateUniforms();
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [camera]);

  // Update visibility
  useEffect(() => {
    if (workplaneGroupRef.current) {
      workplaneGroupRef.current.visible = visible;
    }
  }, [visible]);

  return null; // This is a Three.js component, no React render
};

export default WorkplaneGrid;