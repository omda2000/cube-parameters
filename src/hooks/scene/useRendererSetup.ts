
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useOptimizedRenderer } from '../viewer/useOptimizedRenderer';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const useRendererSetup = (mountRef: React.RefObject<HTMLDivElement>) => {
  // Use the new optimized renderer
  return useOptimizedRenderer(mountRef);
};
