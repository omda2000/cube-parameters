
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useRendererSetup = (mountRef: React.RefObject<HTMLDivElement>, mountReady: boolean = false) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current || !mountReady) {
      console.log('useRendererSetup: Waiting for mount element...');
      return;
    }

    console.log('useRendererSetup: Initializing renderers...');

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

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

    console.log('useRendererSetup: Renderers initialized successfully');

    return () => {
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (mountRef.current && labelRenderer.domElement.parentNode) {
        mountRef.current.removeChild(labelRenderer.domElement);
      }
      renderer.dispose();
    };
  }, [mountRef, mountReady]);

  return {
    rendererRef,
    labelRendererRef
  };
};
