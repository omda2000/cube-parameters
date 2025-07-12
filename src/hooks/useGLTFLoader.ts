
import { useRef, useCallback, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { LoadedModel } from '../types/model';

export const useGLTFLoader = (scene: THREE.Scene | null) => {
  const loaderRef = useRef<GLTFLoader | null>(null);
  const dracoLoaderRef = useRef<DRACOLoader | null>(null);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeLoadingRef = useRef<AbortController | null>(null);

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

  // Cleanup function for geometries and materials
  const disposeObject = useCallback((object: THREE.Object3D) => {
    try {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => {
                if (material.map) material.map.dispose();
                if (material.normalMap) material.normalMap.dispose();
                if (material.bumpMap) material.bumpMap.dispose();
                material.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              if (child.material.normalMap) child.material.normalMap.dispose();
              if (child.material.bumpMap) child.material.bumpMap.dispose();
              child.material.dispose();
            }
          }
        }
      });
    } catch (error) {
      console.error('Error disposing object:', error);
    }
  }, []);

  const loadGLTFModel = useCallback(async (file: File) => {
    console.log('Starting GLTF load process:', file.name);
    
    if (!scene) {
      console.error('Scene not available for GLTF loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    // Cancel any existing loading operation
    if (activeLoadingRef.current) {
      activeLoadingRef.current.abort();
    }

    const abortController = new AbortController();
    activeLoadingRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      // Validate file
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.gltf') && !fileName.endsWith('.glb')) {
        throw new Error('Invalid file format. Please select a GLTF or GLB file.');
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File too large. Please select a file smaller than 50MB.');
      }

      if (!loaderRef.current) {
        throw new Error('GLTF loader not initialized');
      }

      console.log('Reading file as array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if operation was aborted
      if (abortController.signal.aborted) {
        console.log('GLTF loading aborted');
        return;
      }
      
      console.log('Parsing GLTF data...');
      
      // Use Promise-based parsing
      const gltf = await new Promise<any>((resolve, reject) => {
        loaderRef.current!.parse(
          arrayBuffer, 
          '', 
          (result) => resolve(result),
          (error) => reject(error)
        );
      });
      
      // Check if operation was aborted after parsing
      if (abortController.signal.aborted) {
        console.log('GLTF loading aborted after parsing');
        if (gltf.scene) {
          disposeObject(gltf.scene);
        }
        return;
      }
      
      console.log('GLTF parsed successfully:', gltf);
      
      const root = gltf.scene;
      const allMeshes: THREE.Mesh[] = [];
      
      // 1) Flatten: gather all meshes under root
      root.traverse(node => {
        if (node.isMesh) {
          allMeshes.push(node as THREE.Mesh);
        }
      });
      
      console.log(`Found ${allMeshes.length} meshes in GLB`);
      
      // Process meshes: enable shadows and log userData
      allMeshes.forEach((mesh, index) => {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        const { id, type } = mesh.userData || {};
        if (id || type) {
          console.log(`Mesh ${index}: ${mesh.name || 'unnamed'} - id=${id}, type=${type}`);
        }
      });
      
      // 2) Create lookup by ID but keep original structure for now
      const meshesById: { [key: string]: THREE.Mesh } = {};
      const typeStats: { [key: string]: number } = {};
      
      allMeshes.forEach(mesh => {
        const { id, type } = mesh.userData || {};
        
        // Index by ID for direct access
        if (id) {
          meshesById[id] = mesh;
        }
        
        // Count by type for statistics
        if (type) {
          typeStats[type] = (typeStats[type] || 0) + 1;
        }
      });
      
      console.log('Type statistics:', typeStats);
      console.log('Meshes by ID count:', Object.keys(meshesById).length);

      // 1. Compute the model's bounding box
      const box = new THREE.Box3().setFromObject(root);
      
      // 2. Choose pivot point - using center pivot as default
      const pivot = new THREE.Vector3();
      box.getCenter(pivot);
      
      // Alternative: use minimum corner pivot
      // const pivot = box.min.clone();
      
      // 3. Offset the root group so that the pivot lands at (0,0,0)
      root.position.sub(pivot);
      
      console.log(`Model re-centered: pivot at (${pivot.x.toFixed(2)}, ${pivot.y.toFixed(2)}, ${pivot.z.toFixed(2)}) moved to origin`);

      // Optional: Scale model to fit in view (max size of 4 units)
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 4 ? 4 / maxDimension : 1;
      root.scale.setScalar(scale);
      
      console.log(`Model scaled by factor: ${scale.toFixed(2)}`);

      // Create main container group and add the original scene
      const modelGroup = new THREE.Group();
      modelGroup.add(root);
      modelGroup.name = file.name.replace(/\.(gltf|glb)$/i, '');
      
      // Mark as loaded model for proper selection handling
      modelGroup.userData.isLoadedModel = true;
      modelGroup.userData.meshesById = meshesById;
      modelGroup.userData.typeStats = typeStats;
      
      // Mark all children as part of this loaded model
      modelGroup.traverse((child) => {
        if (child !== modelGroup) {
          child.userData.isPartOfLoadedModel = true;
          child.userData.loadedModelRoot = modelGroup;
        }
      });

      const modelData: LoadedModel = {
        id: Date.now().toString(),
        name: file.name.replace(/\.(gltf|glb)$/i, ''),
        object: modelGroup,
        boundingBox: new THREE.Box3().setFromObject(modelGroup),
        size: file.size
      };

      // Remove previous model if exists
      if (currentModel) {
        console.log('Removing previous model from scene');
        scene.remove(currentModel.object);
        disposeObject(currentModel.object);
      }

      console.log('Adding GLTF model to scene');
      scene.add(modelGroup);
      setLoadedModels(prev => [...prev, modelData]);
      setCurrentModel(modelData);
      
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error('Failed to load GLTF model:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
        setError(errorMessage);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
      activeLoadingRef.current = null;
    }
  }, [scene, currentModel, disposeObject]);

  const switchToModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    // Remove current model
    if (currentModel) {
      scene.remove(currentModel.object);
    }

    // Add selected model
    scene.add(model.object);
    setCurrentModel(model);
  }, [scene, loadedModels, currentModel]);

  const removeModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    if (currentModel?.id === modelId) {
      scene.remove(model.object);
      setCurrentModel(null);
    }

    // Dispose of the model to free memory
    disposeObject(model.object);
    setLoadedModels(prev => prev.filter(m => m.id !== modelId));
  }, [scene, loadedModels, currentModel, disposeObject]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any active loading
      if (activeLoadingRef.current) {
        activeLoadingRef.current.abort();
      }
      
      // Dispose DRACO loader
      if (dracoLoaderRef.current) {
        dracoLoaderRef.current.dispose();
      }
      
      // Dispose all loaded models
      loadedModels.forEach(model => {
        try {
          disposeObject(model.object);
        } catch (error) {
          console.warn('Error disposing model on cleanup:', error);
        }
      });
    };
  }, [loadedModels, disposeObject]);

  return {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadGLTFModel,
    switchToModel,
    removeModel
  };
};
