import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { LoadedModel } from '../types/model';
import { disposeObject3D } from './utils/disposeObject3D';

export const useFBXLoader = (scene: THREE.Scene | null) => {
  const loaderRef = useRef<FBXLoader | null>(null);
  const gltfLoaderRef = useRef<GLTFLoader | null>(null);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add loading state tracking to prevent multiple simultaneous loads
  const loadingRef = useRef<boolean>(false);

  // Helper function to detect FBX format (ASCII vs Binary)
  const detectFBXFormat = (arrayBuffer: ArrayBuffer): 'ascii' | 'binary' => {
    const view = new Uint8Array(arrayBuffer, 0, Math.min(1000, arrayBuffer.byteLength));
    const header = new TextDecoder().decode(view);
    
    // ASCII FBX files start with "; FBX" or contain readable text
    if (header.includes('; FBX') || header.includes('FBXHeaderVersion')) {
      return 'ascii';
    }
    
    // Binary FBX files start with "Kaydara FBX Binary" magic bytes
    const binarySignature = 'Kaydara FBX Binary';
    const headerStr = header.substring(0, binarySignature.length);
    if (headerStr === binarySignature) {
      return 'binary';
    }
    
    // Default to binary for unknown format
    return 'binary';
  };

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('FBXLoader: Starting model load process for:', file.name);
    
    if (!scene) {
      console.error('FBXLoader: Scene not available for model loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log('FBXLoader: Load already in progress, ignoring new request');
      return;
    }

    // Set loading state immediately and clear any errors
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    console.log('FBXLoader: Loading state set to true');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let object: THREE.Group | null = null;

      if (ext === 'fbx') {
        if (!loaderRef.current) {
          loaderRef.current = new FBXLoader();
          console.log('FBXLoader: FBX loader initialized');
        }

        console.log('FBXLoader: Reading FBX file as array buffer...');
        const arrayBuffer = await file.arrayBuffer();
        
        // Detect FBX format
        const format = detectFBXFormat(arrayBuffer);
        console.log('FBXLoader: Detected FBX format:', format);

        try {
          // Use proper FBX loading method with Blob URL
          const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          
          console.log('FBXLoader: Loading FBX via loadAsync...');
          object = await loaderRef.current.loadAsync(url);
          
          // Clean up URL
          URL.revokeObjectURL(url);
          
          console.log('FBXLoader: FBX loaded successfully, object type:', object.type);
          console.log('FBXLoader: FBX children count:', object.children.length);
          
          // Log mesh information for debugging
          let meshCount = 0;
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              meshCount++;
              console.log('FBXLoader: Found mesh:', child.name || 'unnamed', 'geometry:', child.geometry.type);
            }
          });
          console.log('FBXLoader: Total meshes found:', meshCount);
          
        } catch (parseError) {
          console.error('FBXLoader: Failed to parse FBX with loadAsync, trying fallback method');
          
          // Fallback: try the parse method for problematic files
          try {
            object = loaderRef.current.parse(arrayBuffer, '');
            console.log('FBXLoader: FBX parsed successfully with fallback method');
          } catch (fallbackError) {
            throw new Error(`FBX parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
          }
        }
        
      } else if (ext === 'gltf' || ext === 'glb') {
        if (!gltfLoaderRef.current) {
          gltfLoaderRef.current = new GLTFLoader();
          console.log('FBXLoader: GLTF loader initialized');
        }

        console.log('FBXLoader: Loading GLTF model...');
        const url = URL.createObjectURL(file);
        const gltf = await gltfLoaderRef.current.loadAsync(url);
        URL.revokeObjectURL(url);
        object = gltf.scene;
        console.log('FBXLoader: GLTF loaded successfully');
      } else {
        throw new Error('Unsupported file format. Please use FBX, GLTF, or GLB files.');
      }
      
      if (!object) {
        throw new Error('Failed to load model object - parsed object is null');
      }

      // Validate object structure
      if (!object.children && object.children !== undefined) {
        console.warn('FBXLoader: Loaded object has no children array');
      }

      console.log('FBXLoader: Processing loaded object...');
      
      // Process the object and mark it as a loaded model
      const processedModel = processModelBatch(object, file.name);
      
      // Mark the object with stable userData to prevent type changes
      processedModel.object.userData.isLoadedModel = true;
      processedModel.object.userData.modelName = processedModel.name;
      processedModel.object.userData.isStable = true;
      processedModel.object.userData.isLoading = false; // Mark as fully loaded
      
      // Remove previous model if exists (single operation)
      if (currentModel) {
        console.log('FBXLoader: Removing previous model from scene');
        scene.remove(currentModel.object);
        disposeObject3D(currentModel.object);
      }

      console.log('FBXLoader: Adding new model to scene');
      scene.add(processedModel.object);
      
      // Batch all state updates at the end to prevent flickering
      console.log('FBXLoader: Model loading completed successfully');
      
      // Use a small delay to ensure scene is fully updated before triggering UI updates
      setTimeout(() => {
        setLoadedModels(prev => {
          // Remove old models and add new one
          const newModels = [processedModel];
          console.log('FBXLoader: Updated loaded models count:', newModels.length);
          return newModels;
        });
        
        setCurrentModel(processedModel);
        console.log('FBXLoader: Set current model:', processedModel.name);
      }, 100);
      
    } catch (err) {
      console.error('FBXLoader: Failed to load model:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
      setError(errorMessage);
    } finally {
      // Always clear loading state with a small delay to prevent flickering
      setTimeout(() => {
        console.log('FBXLoader: Setting loading state to false');
        setIsLoading(false);
        loadingRef.current = false;
      }, 150);
    }
  }, [scene, currentModel]);

  // Enhanced model processing with better validation and marking
  const processModelBatch = (object: THREE.Group, fileName: string): LoadedModel => {
    console.log('FBXLoader: Processing model batch for:', fileName);
    
    // Validate object before processing
    if (!object || typeof object !== 'object') {
      throw new Error('Invalid object provided for processing');
    }
    
    // Fix Z-axis orientation - most FBX files are Y-up, convert to Z-up
    object.rotateX(-Math.PI / 2);

    // Calculate bounding box after rotation
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Center the model at origin
    object.position.sub(center);

    // Scale model to fit in view (max size of 4 units)
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 4 ? 4 / maxDimension : 1;
    object.scale.setScalar(scale);

    // Process all children in one go - avoid individual traverse calls
    const meshes: THREE.Mesh[] = [];
    const groups: THREE.Group[] = [];
    
    object.traverse((child) => {
      // Mark all children as part of loaded model
      child.userData.isFromLoadedModel = true;
      child.userData.parentModelName = fileName.replace(/\.(fbx|gltf|glb)$/i, '');
      child.userData.isStable = true;
      
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
        console.log('FBXLoader: Processing mesh:', child.name || 'unnamed');
      } else if (child instanceof THREE.Group && child !== object) {
        groups.push(child);
        console.log('FBXLoader: Processing group:', child.name || 'unnamed');
      }
    });

    // Batch process all meshes
    meshes.forEach(mesh => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // Improve material if it's basic
      if (mesh.material instanceof THREE.MeshBasicMaterial) {
        const newMaterial = new THREE.MeshPhongMaterial({
          color: mesh.material.color,
          map: mesh.material.map
        });
        mesh.material = newMaterial;
      }
      
      // Ensure geometry is properly named for hierarchy
      if (!mesh.name || mesh.name.trim() === '') {
        mesh.name = `Mesh_${mesh.uuid.slice(0, 8)}`;
      }
    });

    // Process groups
    groups.forEach(group => {
      if (!group.name || group.name.trim() === '') {
        group.name = `Group_${group.uuid.slice(0, 8)}`;
      }
    });

    console.log('FBXLoader: Processed', meshes.length, 'meshes and', groups.length, 'groups in model');

    // Set a proper name for the root object
    if (!object.name || object.name.trim() === '') {
      object.name = fileName.replace(/\.(fbx|gltf|glb)$/i, '');
    }

    const processedModel: LoadedModel = {
      id: Date.now().toString(),
      name: fileName.replace(/\.(fbx|gltf|glb)$/i, ''),
      object,
      boundingBox: new THREE.Box3().setFromObject(object),
      size: 0 // We don't need the file size for counting
    };

    console.log('FBXLoader: Created processed model:', processedModel.name);
    return processedModel;
  };

  const switchToModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    console.log('FBXLoader: Switching to model:', model.name);

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

    console.log('FBXLoader: Removing model:', model.name);

    if (currentModel?.id === modelId) {
      scene.remove(model.object);
      disposeObject3D(model.object);
      setCurrentModel(null);
    } else {
      scene.remove(model.object);
      disposeObject3D(model.object);
    }

    setLoadedModels(prev => prev.filter(m => m.id !== modelId));
  }, [scene, loadedModels, currentModel]);

  return {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  };
};
