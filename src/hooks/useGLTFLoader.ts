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
      
      // Extract & Detach Meshes approach - make each mesh a separate top-level object
      const objectsById: { [key: string]: { mesh: THREE.Mesh, metadata: any } } = {};
      const allMeshes: THREE.Mesh[] = [];
      
      // 1. First pass: collect all meshes and their metadata
      gltf.scene.traverse(node => {
        if (node.isMesh) {
          const mesh = node as THREE.Mesh;
          allMeshes.push(mesh);
          
          // Read metadata from userData
          const { id, type, name, params } = mesh.userData || {};
          
          if (id) {
            // Parse params if it's a JSON string
            let parsedParams = {};
            if (params && typeof params === 'string') {
              try {
                parsedParams = JSON.parse(params);
              } catch (e) {
                console.warn('Failed to parse params for object', id, ':', e);
                parsedParams = { raw: params };
              }
            } else if (params && typeof params === 'object') {
              parsedParams = params;
            }
            
            console.log(`Found mesh with metadata: id=${id}, type=${type}, name=${name}`);
            
            // Store as a standalone object
            objectsById[id] = {
              mesh: mesh,
              metadata: { id, type, name, params: parsedParams }
            };
          } else {
            console.log(`Mesh without ID found: ${mesh.name || 'unnamed'}`);
          }
        }
      });
      
      console.log(`Found ${allMeshes.length} meshes, ${Object.keys(objectsById).length} with valid IDs`);
      
      // 2. Detach meshes from their parent groups and position them properly
      const detachedMeshes: THREE.Mesh[] = [];
      
      Object.values(objectsById).forEach(({ mesh, metadata }) => {
        // Store world position before detaching
        const worldPosition = new THREE.Vector3();
        const worldRotation = new THREE.Euler();
        const worldScale = new THREE.Vector3();
        
        mesh.getWorldPosition(worldPosition);
        mesh.getWorldQuaternion(new THREE.Quaternion().setFromEuler(worldRotation));
        mesh.getWorldScale(worldScale);
        
        // Detach from parent group
        if (mesh.parent) {
          mesh.parent.remove(mesh);
        }
        
        // Apply world transform to maintain position
        mesh.position.copy(worldPosition);
        mesh.rotation.copy(worldRotation);
        mesh.scale.copy(worldScale);
        
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Store metadata for easy access
        mesh.userData = {
          ...mesh.userData,
          isDetachedFromGLB: true,
          originalMetadata: metadata
        };
        
        detachedMeshes.push(mesh);
        console.log(`Detached mesh: ${metadata.name || metadata.id} at position:`, worldPosition);
      });
      
      // 3. Calculate collective bounding box for centering
      const collectiveBoundingBox = new THREE.Box3();
      detachedMeshes.forEach(mesh => {
        const meshBox = new THREE.Box3().setFromObject(mesh);
        collectiveBoundingBox.union(meshBox);
      });
      
      // 4. Center all meshes at origin as a collection
      const pivot = new THREE.Vector3();
      collectiveBoundingBox.getCenter(pivot);
      
      console.log('Collective bounding box:', {
        min: { x: collectiveBoundingBox.min.x.toFixed(2), y: collectiveBoundingBox.min.y.toFixed(2), z: collectiveBoundingBox.min.z.toFixed(2) },
        max: { x: collectiveBoundingBox.max.x.toFixed(2), y: collectiveBoundingBox.max.y.toFixed(2), z: collectiveBoundingBox.max.z.toFixed(2) },
        center: { x: pivot.x.toFixed(2), y: pivot.y.toFixed(2), z: pivot.z.toFixed(2) }
      });
      
      // Apply centering offset to all meshes
      detachedMeshes.forEach(mesh => {
        mesh.position.sub(pivot);
      });
      
      // 5. Optional scaling
      const size = collectiveBoundingBox.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 4 ? 4 / maxDimension : 1;
      
      if (scale !== 1) {
        detachedMeshes.forEach(mesh => {
          mesh.position.multiplyScalar(scale);
          mesh.scale.multiplyScalar(scale);
        });
        console.log(`All meshes scaled by factor: ${scale.toFixed(2)}`);
      }
      
      // 6. Create main container group that holds references to the detached meshes
      const modelGroup = new THREE.Group();
      modelGroup.name = file.name.replace(/\.(gltf|glb)$/i, '');
      
      // Store metadata and object references for management
      modelGroup.userData.isLoadedModel = true;
      modelGroup.userData.objectsById = objectsById;
      modelGroup.userData.detachedMeshes = detachedMeshes;
      modelGroup.userData.meshCount = detachedMeshes.length;
      
      // Add each detached mesh directly to the scene (not to the group)
      detachedMeshes.forEach(mesh => {
        scene.add(mesh);
        
        // Mark mesh as part of this loaded model for cleanup purposes
        mesh.userData.loadedModelRoot = modelGroup;
        mesh.userData.isPartOfLoadedModel = true;
      });

      const modelData: LoadedModel = {
        id: Date.now().toString(),
        name: file.name.replace(/\.(gltf|glb)$/i, ''),
        object: modelGroup, // This is just for reference, actual meshes are in scene
        boundingBox: collectiveBoundingBox.clone(),
        size: file.size
      };

      // Remove previous model if exists
      if (currentModel) {
        console.log('Removing previous model from scene');
        // Remove all detached meshes from the previous model
        if (currentModel.object.userData.detachedMeshes) {
          currentModel.object.userData.detachedMeshes.forEach((mesh: THREE.Mesh) => {
            scene.remove(mesh);
          });
        }
        scene.remove(currentModel.object);
        disposeObject(currentModel.object);
      }

      console.log(`Added ${detachedMeshes.length} separate mesh objects to scene`);
      console.log('Objects accessible by ID:', Object.keys(objectsById));
      
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

    // Remove current model's meshes
    if (currentModel && currentModel.object.userData.detachedMeshes) {
      currentModel.object.userData.detachedMeshes.forEach((mesh: THREE.Mesh) => {
        scene.remove(mesh);
      });
    }

    // Add selected model's meshes
    if (model.object.userData.detachedMeshes) {
      model.object.userData.detachedMeshes.forEach((mesh: THREE.Mesh) => {
        scene.add(mesh);
      });
    }
    setCurrentModel(model);
  }, [scene, loadedModels, currentModel]);

  const removeModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    if (currentModel?.id === modelId) {
      // Remove all detached meshes from scene
      if (model.object.userData.detachedMeshes) {
        model.object.userData.detachedMeshes.forEach((mesh: THREE.Mesh) => {
          scene.remove(mesh);
        });
      }
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
          // Remove detached meshes from scene
          if (model.object.userData.detachedMeshes) {
            model.object.userData.detachedMeshes.forEach((mesh: THREE.Mesh) => {
              if (scene) scene.remove(mesh);
            });
          }
          disposeObject(model.object);
        } catch (error) {
          console.warn('Error disposing model on cleanup:', error);
        }
      });
    };
  }, [loadedModels, disposeObject, scene]);

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