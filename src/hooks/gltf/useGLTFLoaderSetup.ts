
import { useRef, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export const useGLTFLoaderSetup = () => {
  const loaderRef = useRef<GLTFLoader | null>(null);
  const dracoLoaderRef = useRef<DRACOLoader | null>(null);

  // Initialize loaders
  useEffect(() => {
    if (!loaderRef.current) {
      loaderRef.current = new GLTFLoader();
      
      // Set up DRACO loader for compressed GLTF files
      dracoLoaderRef.current = new DRACOLoader();
      dracoLoaderRef.current.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      loaderRef.current.setDRACOLoader(dracoLoaderRef.current);
      
      console.log('GLTF and DRACO loaders initialized');
    }
  }, []);

  return {
    loaderRef,
    dracoLoaderRef
  };
};
