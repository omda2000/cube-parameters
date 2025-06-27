
import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { ResourceManager } from './utils/ResourceManager';
import { useThreePerformance } from './useThreePerformance';

export const useThreeScene = (mountRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ucsHelperRef = useRef<THREE.AxesHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const resourceManagerRef = useRef<ResourceManager>(ResourceManager.getInstance());

  const { metrics } = useThreePerformance(rendererRef.current);

  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current || !labelRendererRef.current) return;

    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const labelRenderer = labelRendererRef.current;

    camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
  }, [mountRef]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.01,
      2000
    );
    cameraRef.current = camera;
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup with better quality and performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: "high-performance" // Request high-performance GPU
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    // Performance optimizations
    renderer.info.autoReset = false; // Manual reset for better performance tracking
    
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
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI;
    
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
    
    // Add UCS (User Coordinate System) display at origin (0,0,0) using ResourceManager
    const ucsHelper = new THREE.AxesHelper(2);
    ucsHelperRef.current = ucsHelper;
    ucsHelper.position.set(0, 0, 0);
    scene.add(ucsHelper);

    // Add single horizontal grid helper for reference using ResourceManager
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelperRef.current = gridHelper;
    gridHelper.position.set(0, 0, 0);
    scene.add(gridHelper);

    window.addEventListener('resize', handleResize);

    // Optimized animation loop with frame rate monitoring
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Throttle to target FPS for better performance on slower devices
      if (currentTime - lastTime >= frameInterval) {
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        
        // Reset render info for next frame
        renderer.info.reset();
        
        lastTime = currentTime;
      }
    };
    animate(0);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
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
      
      // Clean up resources
      resourceManagerRef.current.disposeAll();
    };
  }, [handleResize]);

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics: metrics
  };
};
