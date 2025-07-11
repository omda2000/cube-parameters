
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
};

export const useRendererSetup = (mountRef: React.RefObject<HTMLDivElement>) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const mobile = isMobile();

    // Enhanced WebGL renderer with mobile optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !mobile, // Disable antialiasing on mobile for performance
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: mobile ? "default" : "high-performance",
      stencil: false,
      depth: true,
      preserveDrawingBuffer: false
    });
    
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    
    // Mobile-optimized pixel ratio
    const pixelRatio = mobile ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    
    // Enhanced shadow settings with mobile optimization
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = mobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    
    // Tone mapping and color management
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Performance optimizations
    renderer.sortObjects = true;
    renderer.info.autoReset = false;
    renderer.setScissorTest(false);
    
    // Mobile-specific optimizations
    if (mobile) {
      renderer.capabilities.maxTextures = Math.min(renderer.capabilities.maxTextures, 16);
      
      // Reduce precision for mobile
      renderer.capabilities.precision = 'mediump';
    }
    
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced CSS2D renderer
    const labelRenderer = new CSS2DRenderer();
    labelRendererRef.current = labelRenderer;
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.zIndex = '1';
    
    // Mobile-specific label renderer settings
    if (mobile) {
      labelRenderer.domElement.style.webkitTransform = 'translate3d(0,0,0)';
      labelRenderer.domElement.style.transform = 'translate3d(0,0,0)';
    }
    
    mountRef.current.appendChild(labelRenderer.domElement);

    return () => {
      if (mountRef.current) {
        if (renderer.domElement.parentNode) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (labelRenderer.domElement.parentNode) {
          mountRef.current.removeChild(labelRenderer.domElement);
        }
      }
      
      // Enhanced cleanup
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [mountRef]);

  return {
    rendererRef,
    labelRendererRef
  };
};
