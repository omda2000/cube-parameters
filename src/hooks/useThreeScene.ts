
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useThreeScene = (mountRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ucsHelperRef = useRef<THREE.AxesHelper | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, // Slightly narrower FOV for better perspective
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.01, // Closer near plane for detail work
      2000 // Farther far plane for large models
    );
    cameraRef.current = camera;
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true // Better depth precision
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    mountRef.current.appendChild(renderer.domElement);

    // Label renderer setup
    const labelRenderer = new CSS2DRenderer();
    labelRendererRef.current = labelRenderer;
    labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    // Enhanced OrbitControls for Revit-style navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    
    // Revit-style navigation settings
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false; // Keep panning in world space
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI; // Allow full rotation
    
    // Mouse button configuration (Revit-style)
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    
    // Touch controls
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    // Smooth rotation and zoom
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.8;
    
    // Add UCS (User Coordinate System) display
    const ucsHelper = new THREE.AxesHelper(1);
    ucsHelperRef.current = ucsHelper;
    ucsHelper.position.set(0, 0, 0);
    scene.add(ucsHelper);

    // Add grid helper for reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.rotateX(Math.PI / 2); // Rotate to XY plane (Z-up)
    scene.add(gridHelper);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer || !labelRenderer) return;

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        if (renderer.domElement.parentNode) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (labelRenderer.domElement.parentNode) {
          mountRef.current.removeChild(labelRenderer.domElement);
        }
      }
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef
  };
};
