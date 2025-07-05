import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useOptimizedRenderer = (mountRef: React.RefObject<HTMLDivElement>) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);

  // Optimized renderer initialization with Three.js r178 features
  const initializeRenderer = useCallback(() => {
    if (!mountRef.current) return null;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Enhanced renderer setup with latest optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: "high-performance",
      // New in r178: Improved memory management
      preserveDrawingBuffer: false,
      precision: 'highp'
    });

    // Enhanced performance settings
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Optimized shadow settings
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    
    // Enhanced tone mapping (improved in recent versions)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Color management improvements
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Performance optimizations
    renderer.info.autoReset = false;
    renderer.debug.checkShaderErrors = process.env.NODE_ENV === 'development';
    
    // Memory management
    renderer.setAnimationLoop(null); // We'll handle animation loop separately
    
    return renderer;
  }, [mountRef]);

  // Initialize label renderer with optimizations
  const initializeLabelRenderer = useCallback(() => {
    if (!mountRef.current) return null;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.zIndex = '1';
    
    return labelRenderer;
  }, [mountRef]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize renderers
    const renderer = initializeRenderer();
    const labelRenderer = initializeLabelRenderer();
    
    if (!renderer || !labelRenderer) return;

    rendererRef.current = renderer;
    labelRendererRef.current = labelRenderer;

    // Append to DOM
    mountRef.current.appendChild(renderer.domElement);
    mountRef.current.appendChild(labelRenderer.domElement);

    return () => {
      // Enhanced cleanup
      if (mountRef.current) {
        if (renderer.domElement.parentNode) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (labelRenderer.domElement.parentNode) {
          mountRef.current.removeChild(labelRenderer.domElement);
        }
      }
      
      // Proper disposal
      renderer.dispose();
      renderer.forceContextLoss();
      
      // Clear references
      rendererRef.current = null;
      labelRendererRef.current = null;
    };
  }, [mountRef, initializeRenderer, initializeLabelRenderer]);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !labelRendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    rendererRef.current.setSize(width, height);
    labelRendererRef.current.setSize(width, height);
  }, [mountRef]);

  return {
    rendererRef,
    labelRendererRef,
    handleResize
  };
};