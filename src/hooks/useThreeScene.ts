
import { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { ResourceManager } from './utils/ResourceManager';
import { useThreePerformance } from './useThreePerformance';

export const useThreeScene = (mountRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  const [isOrthographic, setIsOrthographic] = useState(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ucsHelperRef = useRef<THREE.AxesHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const resourceManagerRef = useRef<ResourceManager>(ResourceManager.getInstance());

  const { metrics } = useThreePerformance(rendererRef.current);

  const switchCamera = useCallback((orthographic: boolean) => {
    if (!mountRef.current || !controlsRef.current) return;

    const controls = controlsRef.current;
    const currentPosition = controls.object.position.clone();
    const currentTarget = controls.target.clone();

    if (orthographic && orthographicCameraRef.current) {
      // Switch to orthographic
      const orthoCamera = orthographicCameraRef.current;
      orthoCamera.position.copy(currentPosition);
      orthoCamera.lookAt(currentTarget);
      
      controls.object = orthoCamera;
      activeCameraRef.current = orthoCamera;
      setIsOrthographic(true);
    } else if (!orthographic && perspectiveCameraRef.current) {
      // Switch to perspective
      const perspCamera = perspectiveCameraRef.current;
      perspCamera.position.copy(currentPosition);
      perspCamera.lookAt(currentTarget);
      
      controls.object = perspCamera;
      activeCameraRef.current = perspCamera;
      setIsOrthographic(false);
    }

    controls.target.copy(currentTarget);
    controls.update();
  }, [mountRef]);

  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !labelRendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const aspect = width / height;

    // Update perspective camera
    if (perspectiveCameraRef.current) {
      perspectiveCameraRef.current.aspect = aspect;
      perspectiveCameraRef.current.updateProjectionMatrix();
    }

    // Update orthographic camera
    if (orthographicCameraRef.current) {
      const frustumSize = 10;
      orthographicCameraRef.current.left = -frustumSize * aspect / 2;
      orthographicCameraRef.current.right = frustumSize * aspect / 2;
      orthographicCameraRef.current.top = frustumSize / 2;
      orthographicCameraRef.current.bottom = -frustumSize / 2;
      orthographicCameraRef.current.updateProjectionMatrix();
    }

    rendererRef.current.setSize(width, height);
    labelRendererRef.current.setSize(width, height);
  }, [mountRef]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const aspect = width / height;

    // Perspective Camera setup
    const perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 0.01, 2000);
    perspectiveCameraRef.current = perspectiveCamera;
    perspectiveCamera.position.set(5, 5, 5);
    perspectiveCamera.lookAt(0, 0, 0);

    // Orthographic Camera setup
    const frustumSize = 10;
    const orthographicCamera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, frustumSize * aspect / 2,
      frustumSize / 2, -frustumSize / 2,
      0.01, 2000
    );
    orthographicCameraRef.current = orthographicCamera;
    orthographicCamera.position.set(5, 5, 5);
    orthographicCamera.lookAt(0, 0, 0);

    // Set initial active camera
    activeCameraRef.current = perspectiveCamera;

    // Renderer setup with better quality and performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: "high-performance"
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.info.autoReset = false;
    
    mountRef.current.appendChild(renderer.domElement);

    // Label renderer setup
    const labelRenderer = new CSS2DRenderer();
    labelRendererRef.current = labelRenderer;
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    // Enhanced OrbitControls
    const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
    controlsRef.current = controls;
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI;
    
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.8;
    
    // Add UCS and grid helpers
    const ucsHelper = new THREE.AxesHelper(2);
    ucsHelperRef.current = ucsHelper;
    ucsHelper.position.set(0, 0, 0);
    scene.add(ucsHelper);

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelperRef.current = gridHelper;
    gridHelper.position.set(0, 0, 0);
    scene.add(gridHelper);

    // Expose camera switching globally
    (window as any).__switchCamera = switchCamera;

    window.addEventListener('resize', handleResize);

    // Animation loop
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (currentTime - lastTime >= frameInterval) {
        controls.update();
        if (activeCameraRef.current) {
          renderer.render(scene, activeCameraRef.current);
          labelRenderer.render(scene, activeCameraRef.current);
        }
        renderer.info.reset();
        lastTime = currentTime;
      }
    };
    animate(0);

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
      resourceManagerRef.current.disposeAll();
      
      delete (window as any).__switchCamera;
    };
  }, [handleResize, switchCamera]);

  return {
    sceneRef,
    cameraRef: activeCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics: metrics,
    isOrthographic,
    switchCamera
  };
};
