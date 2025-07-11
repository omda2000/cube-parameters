
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
};

export const useRendererSetup = (mountRef: React.RefObject<HTMLDivElement>, isMountReady: boolean) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const [isRendererReady, setIsRendererReady] = useState(false);

  useEffect(() => {
    if (!isMountReady || !mountRef.current) {
      console.log('Renderer setup waiting for mount...');
      return;
    }

    try {
      console.log('Setting up renderer...');
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      if (width <= 0 || height <= 0) {
        console.warn('Invalid dimensions for renderer setup:', { width, height });
        return;
      }
      
      const mobile = isMobile();

      const renderer = new THREE.WebGLRenderer({ 
        antialias: !mobile,
        alpha: true,
        logarithmicDepthBuffer: true,
        powerPreference: mobile ? "default" : "high-performance",
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false
      });
      
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      
      const pixelRatio = mobile ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
      
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = mobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = true;
      
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      
      renderer.sortObjects = true;
      renderer.info.autoReset = false;
      renderer.setScissorTest(false);
      
      if (mobile) {
        renderer.capabilities.maxTextures = Math.min(renderer.capabilities.maxTextures, 16);
        renderer.capabilities.precision = 'mediump';
      }
      
      mountRef.current.appendChild(renderer.domElement);
      console.log('WebGL renderer created and mounted');

      const labelRenderer = new CSS2DRenderer();
      labelRendererRef.current = labelRenderer;
      labelRenderer.setSize(width, height);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0';
      labelRenderer.domElement.style.pointerEvents = 'none';
      labelRenderer.domElement.style.zIndex = '1';
      
      if (mobile) {
        labelRenderer.domElement.style.webkitTransform = 'translate3d(0,0,0)';
        labelRenderer.domElement.style.transform = 'translate3d(0,0,0)';
      }
      
      mountRef.current.appendChild(labelRenderer.domElement);
      console.log('CSS2D renderer created and mounted');
      
      setIsRendererReady(true);
      console.log('Renderer setup completed successfully');
    } catch (error) {
      console.error('Error setting up renderer:', error);
      setIsRendererReady(false);
    }

    return () => {
      if (mountRef.current && rendererRef.current) {
        try {
          if (rendererRef.current.domElement.parentNode) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
          if (labelRendererRef.current?.domElement.parentNode) {
            mountRef.current.removeChild(labelRendererRef.current.domElement);
          }
        } catch (error) {
          console.warn('Error removing renderer elements:', error);
        }
      }
      
      if (rendererRef.current) {
        try {
          rendererRef.current.dispose();
          rendererRef.current.forceContextLoss();
        } catch (error) {
          console.warn('Error disposing renderer:', error);
        }
      }
    };
  }, [mountRef, isMountReady]);

  return {
    rendererRef,
    labelRendererRef,
    isRendererReady
  };
};
