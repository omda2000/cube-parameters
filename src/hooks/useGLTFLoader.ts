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
      console.log('Scene children count:', gltf.scene.children.length);
      console.log('Scene structure:', gltf.scene);
      
      // Extract & Detach Meshes approach - make each mesh a separate top-level object
      const objectsById: { [key: string]: { mesh: THREE.Mesh, metadata: any } } = {};
      const allMeshes: THREE.Mesh[] = [];
      
      // 1. First pass: collect all meshes and read metadata from userData.object_params
      console.log('Starting mesh traversal...');
      
      gltf.scene.traverse(node => {
        console.log('Traversing node:', node.type, node.name || 'unnamed', 'isMesh:', node.isMesh);
        console.log('Node userData:', node.userData);
        
        if (node.isMesh) {
          const mesh = node as THREE.Mesh;
          allMeshes.push(mesh);
          
          // Three.js automatically maps GLTF extras → userData
          // Check for object_params that should contain our 5 required fields
          let metadata = null;
          
          console.log(`🔍 Checking mesh "${mesh.name}" userData:`, mesh.userData);
          
          if (mesh.userData?.object_params) {
            const objectParams = mesh.userData.object_params;
            console.log(`✅ Found object_params in userData:`, objectParams);
            
            // Use exact values from GLTF extras.object_params
            metadata = {
              id: objectParams.id,
              name: objectParams.name,
              parent_id: objectParams.parent_id,
              type: objectParams.type,
              function: objectParams.function
            };
            console.log(`✅ Extracted metadata from object_params:`, metadata);
          } else {
            console.log('❌ No object_params found in userData, creating fallback');
            // Fallback metadata
            metadata = {
              id: mesh.name || `mesh_${allMeshes.length - 1}_${mesh.uuid.slice(0, 8)}`,
              name: mesh.name || `Mesh_${allMeshes.length - 1}`,
              parent_id: 'none',
              type: 'mesh',
              function: 'none'
            };
            console.log(`🔄 Fallback metadata:`, metadata);
          }
          
          // Final fallback if no metadata found
          if (!metadata) {
            console.log('No GLTF metadata found, creating fallback...');
            metadata = {
              id: `mesh_${allMeshes.length - 1}_${mesh.uuid.slice(0, 8)}`,
              name: node.name || `Mesh_${allMeshes.length - 1}`,
              parent_id: 'none',
              type: 'mesh',
              function: 'none'
            };
          }
          
          if (metadata && metadata.id) {
            console.log(`Found mesh with metadata: id=${metadata.id}, type=${metadata.type}, name=${metadata.name}`);
            
            // Store as a standalone object
            objectsById[metadata.id] = {
              mesh: mesh,
              metadata: metadata
            };
          } else {
            console.log(`Mesh without valid metadata found: ${mesh.name || 'unnamed'}`);
            // Create fallback metadata
            const fallbackId = `mesh_${allMeshes.length - 1}_${mesh.uuid.slice(0, 8)}`;
            objectsById[fallbackId] = {
              mesh: mesh,
              metadata: { 
                id: fallbackId, 
                name: mesh.name || `Mesh_${allMeshes.length - 1}`,
                parent_id: 'none',
                type: 'unknown', 
                function: 'none'
              }
            };
          }
        }
      });
      
      console.log(`Mesh traversal complete. Found ${allMeshes.length} meshes, ${Object.keys(objectsById).length} with valid IDs`);
      
      if (allMeshes.length === 0) {
        console.error('No meshes found in GLB file!');
        throw new Error('No meshes found in the GLB file. Please check that the file contains 3D geometry.');
      }
      
      if (Object.keys(objectsById).length === 0) {
        console.warn('No meshes with ID metadata found. Adding all meshes without metadata...');
        // Fallback: add all meshes even without metadata
        allMeshes.forEach((mesh, index) => {
          const fallbackId = `mesh_${index}_${mesh.uuid.slice(0, 8)}`;
          objectsById[fallbackId] = {
            mesh: mesh,
            metadata: { 
              id: fallbackId, 
              name: mesh.name || `Mesh_${index}`,
              parent_id: 'none',
              type: 'unknown', 
              function: 'none'
            }
          };
        });
        console.log(`Added ${Object.keys(objectsById).length} meshes with fallback IDs`);
      }
      
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
         
         // Store metadata in the format expected by property panel
         // Keep object_params if it exists, or store metadata directly
         mesh.userData = {
           // Preserve original object_params if it was found
           ...(mesh.userData?.object_params ? { object_params: mesh.userData.object_params } : {}),
           // Store metadata directly in userData for easy access
           id: metadata.id,
           name: metadata.name,
           parent_id: metadata.parent_id,
           type: metadata.type, 
           function: metadata.function,
           isDetachedFromGLB: true,
           originalMetadata: metadata,
           loadedModelId: Date.now().toString()
         };
         
         console.log(`✅ Stored metadata in mesh.userData for "${mesh.name}":`, {
           id: mesh.userData.id,
           name: mesh.userData.name,
           parent_id: mesh.userData.parent_id,
           type: mesh.userData.type,
           function: mesh.userData.function
         });
         
         detachedMeshes.push(mesh);
         console.log(`Detached mesh: ${metadata.name || metadata.id} at position:`, worldPosition);
       });
      
       // 3. Create container group and add individual meshes to scene
       const container = new THREE.Group();
       container.name = file.name.replace(/\.(gltf|glb)$/i, '');
       
       // Add each detached mesh directly to the scene so they appear in hierarchy
       detachedMeshes.forEach(mesh => {
         scene.add(mesh);
         // Mark mesh as belonging to this loaded model
         mesh.userData.loadedModelId = Date.now().toString();
         mesh.userData.isDetachedFromGLB = true;
       });
       
       // 4. Compute bounding box from all meshes
       const tempContainer = new THREE.Group();
       detachedMeshes.forEach(mesh => tempContainer.add(mesh.clone()));
       const box = new THREE.Box3().setFromObject(tempContainer);
       
       console.log(`Added ${detachedMeshes.length} individual meshes to scene`);
       
       // Store metadata and object references for management
       container.userData.isLoadedModel = true;
       container.userData.objectsById = objectsById;
       container.userData.detachedMeshes = detachedMeshes;
       container.userData.meshCount = detachedMeshes.length;

       const modelData: LoadedModel = {
         id: Date.now().toString(),
         name: file.name.replace(/\.(gltf|glb)$/i, ''),
         object: container,
         boundingBox: box.clone(),
         size: file.size
       };

      // Remove previous model if exists
      if (currentModel) {
        console.log('Removing previous model from scene');
        scene.remove(currentModel.object);
        disposeObject(currentModel.object);
      }

      console.log(`Added container with ${detachedMeshes.length} mesh objects to scene`);
      console.log('Objects accessible by ID:', Object.keys(objectsById));
      console.log('Container position:', { x: container.position.x.toFixed(2), y: container.position.y.toFixed(2), z: container.position.z.toFixed(2) });
      
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