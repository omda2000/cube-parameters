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

  // Enhanced FBX format detection with better validation
  const detectFBXFormat = (arrayBuffer: ArrayBuffer): 'ascii' | 'binary' => {
    const view = new Uint8Array(arrayBuffer, 0, Math.min(1000, arrayBuffer.byteLength));
    const header = new TextDecoder().decode(view);
    
    console.log('FBXLoader: Format detection - header sample:', header.substring(0, 50));
    
    // ASCII FBX files contain readable text markers
    if (header.includes('; FBX') || header.includes('FBXHeaderVersion') || header.includes('Creator:')) {
      console.log('FBXLoader: Detected ASCII format');
      return 'ascii';
    }
    
    // Binary FBX files start with specific magic bytes
    const binarySignature = 'Kaydara FBX Binary';
    if (header.startsWith(binarySignature)) {
      console.log('FBXLoader: Detected binary format');
      return 'binary';
    }
    
    // Additional checks for binary format
    if (view[0] === 0x4B && view[1] === 0x61 && view[2] === 0x79) { // "Kay" in binary
      console.log('FBXLoader: Detected binary format via magic bytes');
      return 'binary';
    }
    
    console.log('FBXLoader: Format unclear, defaulting to binary');
    return 'binary';
  };

  // Enhanced resource path extraction
  const extractResourcePath = (filename: string): string => {
    const lastSlash = filename.lastIndexOf('/');
    const lastBackslash = filename.lastIndexOf('\\');
    const lastSeparator = Math.max(lastSlash, lastBackslash);
    
    if (lastSeparator > -1) {
      return filename.substring(0, lastSeparator + 1);
    }
    return '';
  };

  // Enhanced object validation
  const validateLoadedObject = (object: THREE.Group): boolean => {
    if (!object) {
      console.error('FBXLoader: Object is null or undefined');
      return false;
    }
    
    if (!(object instanceof THREE.Object3D)) {
      console.error('FBXLoader: Object is not a THREE.Object3D instance');
      return false;
    }
    
    console.log('FBXLoader: Object validation passed:', {
      type: object.type,
      hasChildren: object.children.length > 0,
      name: object.name || 'unnamed'
    });
    
    return true;
  };

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('=== FBXLoader: Starting enhanced model load ===');
    console.log('FBXLoader: File details:', {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
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
    console.log('FBXLoader: Loading state activated');

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
        console.log('FBXLoader: File read as ArrayBuffer, size:', (arrayBuffer.byteLength / 1024).toFixed(2) + ' KB');
        
        // Detect and log FBX format
        const format = detectFBXFormat(arrayBuffer);
        console.log('FBXLoader: Using format:', format);
        
        try {
          // Primary method: Use loadAsync with Blob URL
          console.log('FBXLoader: Attempting loadAsync method');
          const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          
          object = await loaderRef.current.loadAsync(url);
          URL.revokeObjectURL(url);
          console.log('FBXLoader: loadAsync successful');
          
        } catch (loadAsyncError) {
          console.warn('FBXLoader: loadAsync failed, trying parse method');
          console.warn('FBXLoader: loadAsync error:', loadAsyncError);
          
          // Enhanced fallback method with proper resource path
          try {
            const resourcePath = extractResourcePath(file.name);
            console.log('FBXLoader: Using resource path for parse:', resourcePath || '(empty)');
            
            // Try parse method with resource path
            object = loaderRef.current.parse(arrayBuffer, resourcePath);
            console.log('FBXLoader: parse method successful');
            
          } catch (parseError) {
            console.error('FBXLoader: Both loadAsync and parse methods failed');
            console.error('FBXLoader: Parse error details:', parseError);
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
        throw new Error(`Unsupported file format: ${ext}. Please use FBX, GLTF, or GLB files.`);
      }
      
      // Enhanced validation
      if (!validateLoadedObject(object)) {
        throw new Error('Failed to load model - object validation failed');
      }

      console.log('FBXLoader: Model loaded and validated, processing...');
      
      // Process the model with enhanced validation
      const processedModel = processModelBatch(object, file.name);
      
      if (!processedModel || !processedModel.object) {
        throw new Error('Model processing failed - processed model is invalid');
      }
      
      // Enhanced object marking with stability
      processedModel.object.userData.isLoadedModel = true;
      processedModel.object.userData.modelName = processedModel.name;
      processedModel.object.userData.isStable = true;
      processedModel.object.userData.loadTimestamp = Date.now();
      
      // Clean scene before adding new model
      if (currentModel) {
        console.log('FBXLoader: Removing previous model from scene');
        scene.remove(currentModel.object);
        disposeObject3D(currentModel.object);
      }

      // Add new model to scene with validation
      console.log('FBXLoader: Adding processed model to scene');
      scene.add(processedModel.object);
      
      // Validate scene addition
      const sceneHasModel = scene.children.includes(processedModel.object);
      console.log('FBXLoader: Model added to scene:', sceneHasModel);
      
      if (!sceneHasModel) {
        throw new Error('Failed to add model to scene');
      }
      
      // Update state
      console.log('FBXLoader: Updating state with new model');
      setLoadedModels([processedModel]);
      setCurrentModel(processedModel);
      
      console.log('=== FBXLoader: Model loading completed successfully ===');
      
    } catch (err) {
      console.error('=== FBXLoader: Model loading failed ===');
      console.error('FBXLoader: Error details:', err);
      
      let errorMessage = 'Failed to load model. Please check the file format.';
      if (err instanceof Error) {
        errorMessage = `Loading failed: ${err.message}`;
      }
      
      setError(errorMessage);
      
    } finally {
      console.log('FBXLoader: Setting loading state to false');
      setIsLoading(false);
    }
  }, [scene, currentModel]);

  const processModelBatch = (object: THREE.Group, fileName: string): LoadedModel => {
    console.log('FBXLoader: Processing model batch for:', fileName);
    
    try {
      // Fix Z-axis orientation for FBX files (Y-up to Z-up conversion)
      object.rotateX(-Math.PI / 2);

      // Calculate and log bounding box
      const boundingBox = new THREE.Box3().setFromObject(object);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      console.log('FBXLoader: Model bounds calculated:', {
        center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
        size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) }
      });

      // Center the model
      object.position.sub(center);

      // Scale model to fit in view (max size of 4 units)
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 4 ? 4 / maxDimension : 1;
      object.scale.setScalar(scale);

      console.log('FBXLoader: Model transformation applied:', {
        scale: scale.toFixed(3),
        maxDimension: maxDimension.toFixed(2)
      });

      // Process all children with enhanced marking
      let meshCount = 0;
      let groupCount = 0;
      let materialCount = 0;
      
      object.traverse((child) => {
        // Mark all children as part of loaded model
        child.userData.isFromLoadedModel = true;
        child.userData.parentModelName = fileName.replace(/\.(fbx|gltf|glb)$/i, '');
        child.userData.isStable = true;
        child.userData.loadTimestamp = Date.now();
        
        if (child instanceof THREE.Mesh) {
          meshCount++;
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Count materials
          if (child.material) {
            materialCount++;
          }
          
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

      console.log('FBXLoader: Children processed:', {
        meshCount,
        groupCount,
        materialCount,
        totalChildren: object.children.length
      });

      // Set proper name for the root object
      if (!object.name || object.name.trim() === '') {
        object.name = fileName.replace(/\.(fbx|gltf|glb)$/i, '');
      }

      const processedModel: LoadedModel = {
        id: Date.now().toString(),
        name: fileName.replace(/\.(fbx|gltf|glb)$/i, ''),
        object,
        boundingBox: new THREE.Box3().setFromObject(object),
        size: maxDimension
      };

      console.log('FBXLoader: Processed model created:', {
        id: processedModel.id,
        name: processedModel.name,
        hasObject: !!processedModel.object,
        size: processedModel.size.toFixed(2)
      });
      
      return processedModel;
      
    } catch (processingError) {
      console.error('FBXLoader: Model processing failed:', processingError);
      throw new Error(`Model processing failed: ${processingError instanceof Error ? processingError.message : 'Unknown processing error'}`);
    }
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
