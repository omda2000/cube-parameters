
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

  // Helper function to detect FBX format (ASCII vs Binary)
  const detectFBXFormat = (arrayBuffer: ArrayBuffer): 'ascii' | 'binary' => {
    const view = new Uint8Array(arrayBuffer, 0, Math.min(1000, arrayBuffer.byteLength));
    const header = new TextDecoder().decode(view);
    
    console.log('FBXLoader: Detecting format from header:', header.substring(0, 100));
    
    // ASCII FBX files start with "; FBX" or contain readable text
    if (header.includes('; FBX') || header.includes('FBXHeaderVersion')) {
      console.log('FBXLoader: Detected ASCII format');
      return 'ascii';
    }
    
    // Binary FBX files start with "Kaydara FBX Binary" magic bytes
    const binarySignature = 'Kaydara FBX Binary';
    const headerStr = header.substring(0, binarySignature.length);
    if (headerStr === binarySignature) {
      console.log('FBXLoader: Detected binary format');
      return 'binary';
    }
    
    console.log('FBXLoader: Unknown format, defaulting to binary');
    return 'binary';
  };

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('=== FBXLoader: Starting model load ===');
    console.log('FBXLoader: File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    if (!scene) {
      const errorMsg = 'Scene not available for model loading';
      console.error('FBXLoader:', errorMsg);
      setError(errorMsg);
      return;
    }

    // Clear any previous errors and set loading state
    setError(null);
    setIsLoading(true);
    console.log('FBXLoader: Loading state set to true');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let object: THREE.Group | null = null;

      if (ext === 'fbx') {
        console.log('FBXLoader: Processing FBX file');
        
        if (!loaderRef.current) {
          loaderRef.current = new FBXLoader();
          console.log('FBXLoader: FBX loader initialized');
        }

        const arrayBuffer = await file.arrayBuffer();
        console.log('FBXLoader: File read as ArrayBuffer, size:', arrayBuffer.byteLength);
        
        // Detect FBX format
        const format = detectFBXFormat(arrayBuffer);
        
        try {
          // Primary method: Use Blob URL with loadAsync
          const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          
          console.log('FBXLoader: Attempting to load via loadAsync with Blob URL');
          object = await loaderRef.current.loadAsync(url);
          
          URL.revokeObjectURL(url);
          console.log('FBXLoader: Successfully loaded via loadAsync');
          
        } catch (loadAsyncError) {
          console.warn('FBXLoader: loadAsync failed, trying parse method:', loadAsyncError);
          
          // Fallback method: Use parse with proper resource path
          try {
            // Create a proper resource path for the parse method
            const resourcePath = file.name.substring(0, file.name.lastIndexOf('/') + 1) || '';
            console.log('FBXLoader: Attempting parse with resource path:', resourcePath);
            
            object = loaderRef.current.parse(arrayBuffer, resourcePath);
            console.log('FBXLoader: Successfully parsed via fallback method');
            
          } catch (parseError) {
            console.error('FBXLoader: Both loadAsync and parse methods failed');
            throw new Error(`FBX loading failed: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
          }
        }
        
      } else if (ext === 'gltf' || ext === 'glb') {
        console.log('FBXLoader: Processing GLTF/GLB file');
        
        if (!gltfLoaderRef.current) {
          gltfLoaderRef.current = new GLTFLoader();
          console.log('FBXLoader: GLTF loader initialized');
        }

        const url = URL.createObjectURL(file);
        const gltf = await gltfLoaderRef.current.loadAsync(url);
        URL.revokeObjectURL(url);
        object = gltf.scene;
        console.log('FBXLoader: GLTF loaded successfully');
        
      } else {
        throw new Error('Unsupported file format. Please use FBX, GLTF, or GLB files.');
      }
      
      if (!object) {
        throw new Error('Failed to load model - parsed object is null');
      }

      console.log('FBXLoader: Model loaded successfully, processing...');
      console.log('FBXLoader: Object details:', {
        type: object.type,
        childrenCount: object.children.length,
        name: object.name
      });

      // Process the model immediately without delays
      const processedModel = processModelBatch(object, file.name);
      
      // Mark object with stable userData
      processedModel.object.userData.isLoadedModel = true;
      processedModel.object.userData.modelName = processedModel.name;
      processedModel.object.userData.isStable = true;
      
      // Remove previous model if exists
      if (currentModel) {
        console.log('FBXLoader: Removing previous model from scene');
        scene.remove(currentModel.object);
        disposeObject3D(currentModel.object);
      }

      // Add new model to scene
      console.log('FBXLoader: Adding processed model to scene');
      scene.add(processedModel.object);
      
      // Update state synchronously
      console.log('FBXLoader: Updating state with new model');
      setLoadedModels([processedModel]);
      setCurrentModel(processedModel);
      
      console.log('=== FBXLoader: Model loading completed successfully ===');
      
    } catch (err) {
      console.error('=== FBXLoader: Model loading failed ===');
      console.error('FBXLoader: Error details:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
      setError(errorMessage);
      
    } finally {
      console.log('FBXLoader: Setting loading state to false');
      setIsLoading(false);
    }
  }, [scene, currentModel]);

  const processModelBatch = (object: THREE.Group, fileName: string): LoadedModel => {
    console.log('FBXLoader: Processing model batch for:', fileName);
    
    // Fix Z-axis orientation - FBX files are typically Y-up, convert to Z-up
    object.rotateX(-Math.PI / 2);

    // Calculate bounding box and center the model
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    object.position.sub(center);

    // Scale model to fit in view (max size of 4 units)
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 4 ? 4 / maxDimension : 1;
    object.scale.setScalar(scale);

    console.log('FBXLoader: Model positioning:', {
      originalSize: { x: size.x, y: size.y, z: size.z },
      scale: scale,
      center: { x: center.x, y: center.y, z: center.z }
    });

    // Process all children and mark them appropriately
    let meshCount = 0;
    let groupCount = 0;
    
    object.traverse((child) => {
      // Mark all children as part of loaded model
      child.userData.isFromLoadedModel = true;
      child.userData.parentModelName = fileName.replace(/\.(fbx|gltf|glb)$/i, '');
      child.userData.isStable = true;
      
      if (child instanceof THREE.Mesh) {
        meshCount++;
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Improve basic materials
        if (child.material instanceof THREE.MeshBasicMaterial) {
          const newMaterial = new THREE.MeshPhongMaterial({
            color: child.material.color,
            map: child.material.map
          });
          child.material = newMaterial;
        }
        
        // Ensure proper naming
        if (!child.name || child.name.trim() === '') {
          child.name = `Mesh_${child.uuid.slice(0, 8)}`;
        }
        
      } else if (child instanceof THREE.Group && child !== object) {
        groupCount++;
        if (!child.name || child.name.trim() === '') {
          child.name = `Group_${child.uuid.slice(0, 8)}`;
        }
      }
    });

    console.log('FBXLoader: Processed children:', { meshCount, groupCount });

    // Set proper name for the root object
    if (!object.name || object.name.trim() === '') {
      object.name = fileName.replace(/\.(fbx|gltf|glb)$/i, '');
    }

    const processedModel: LoadedModel = {
      id: Date.now().toString(),
      name: fileName.replace(/\.(fbx|gltf|glb)$/i, ''),
      object,
      boundingBox: new THREE.Box3().setFromObject(object),
      size: 0
    };

    console.log('FBXLoader: Created processed model:', processedModel.name);
    return processedModel;
  };

  const switchToModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    console.log('FBXLoader: Switching to model:', model.name);

    if (currentModel) {
      scene.remove(currentModel.object);
    }

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
