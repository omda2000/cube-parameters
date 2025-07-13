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
      let projectUnits = 'Meters';  // default fallback
      
      // 1. First pass: collect all meshes and parse metadata from mesh.name
      console.log('Starting mesh traversal...');
      gltf.scene.traverse(node => {
        console.log('Traversing node:', node.type, node.name || 'unnamed', 'isMesh:', node.isMesh);
        if (node.isMesh) {
          const mesh = node as THREE.Mesh;
          allMeshes.push(mesh);
          
          // Parse metadata from mesh.name as JSON
          let metadata = null;
          if (mesh.name) {
            try {
              // Try to parse mesh.name as JSON
              metadata = JSON.parse(mesh.name);
              console.log(`Parsed metadata from mesh.name:`, metadata);
            } catch (e) {
              console.warn('Failed to parse mesh.name as JSON for mesh:', mesh.name, ':', e);
              // Fallback: use name as-is
              metadata = { 
                id: mesh.uuid.slice(0, 8), 
                type: 'unknown', 
                name: mesh.name, 
                params: {} 
              };
            }
          }
          
          // If this is the project_data marker, grab units
          if (metadata && metadata.id === 'project_data' && metadata.units) {
            projectUnits = metadata.units;
            console.log(`Found project data with units: ${projectUnits}`);
          }
          
          if (metadata && metadata.id) {
            console.log(`Found mesh with metadata: id=${metadata.id}, type=${metadata.type}, name=${metadata.name}`);
            
            // Detach from parent to make each mesh a top-level object
            if (mesh.parent) {
              mesh.parent.remove(mesh);
            }
            
            // Store as a standalone object (overwrite project_data too if desired)
            objectsById[metadata.id] = {
              mesh: mesh,
              metadata: metadata
            };
          } else {
            console.log(`Mesh without valid metadata found: ${mesh.name || 'unnamed'}`);
            // Create fallback metadata
            const fallbackId = `mesh_${allMeshes.length - 1}_${mesh.uuid.slice(0, 8)}`;
            
            // Detach from parent
            if (mesh.parent) {
              mesh.parent.remove(mesh);
            }
            
            objectsById[fallbackId] = {
              mesh: mesh,
              metadata: { 
                id: fallbackId, 
                type: 'unknown', 
                name: mesh.name || `Mesh_${allMeshes.length - 1}`, 
                params: {} 
              }
            };
          }
        }
      });
      
      console.log(`Mesh traversal complete. Found ${allMeshes.length} meshes, ${Object.keys(objectsById).length} with valid IDs`);
      console.log(`Project units detected: ${projectUnits}`);
      
      if (allMeshes.length === 0) {
        console.error('No meshes found in GLB file!');
        throw new Error('No meshes found in the GLB file. Please check that the file contains 3D geometry.');
      }
      
      if (Object.keys(objectsById).length === 0) {
        console.warn('No meshes with ID metadata found. Adding all meshes without metadata...');
        // Fallback: add all meshes even without metadata
        allMeshes.forEach((mesh, index) => {
          const fallbackId = `mesh_${index}_${mesh.uuid.slice(0, 8)}`;
          
          // Detach from parent
          if (mesh.parent) {
            mesh.parent.remove(mesh);
          }
          
          objectsById[fallbackId] = {
            mesh: mesh,
            metadata: { 
              id: fallbackId, 
              type: 'unknown', 
              name: mesh.name || `Mesh_${index}`, 
              params: {} 
            }
          };
        });
        console.log(`Added ${Object.keys(objectsById).length} meshes with fallback IDs`);
      }
      
      // 2. Compute Scale Factor (convert projectUnits into meters for Three.js)
      const unitScales: { [key: string]: number } = {
        Millimeters: 0.001,
        Centimeters: 0.01,
        Meters: 1.0,
        Inches: 0.0254,
        Feet: 0.3048,
        Yards: 0.9144
      };
      const scale = unitScales[projectUnits] || 1.0;
      console.log(`Applying scale factor: ${scale} (from ${projectUnits} to meters)`);
      
      // 3. Create container group and recenter & scale the model
      const container = new THREE.Group();
      container.name = file.name.replace(/\.(gltf|glb)$/i, '');
      
      // Add each mesh to the container for bounding box calculation
      Object.values(objectsById).forEach(({ mesh, metadata }) => {
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Store metadata for easy access
        mesh.userData = {
          id: metadata.id,
          type: metadata.type, 
          name: metadata.name,
          params: metadata.params,
          units: projectUnits,
          isDetachedFromGLB: true,
          originalMetadata: metadata
        };
        
        container.add(mesh);
        console.log(`Added mesh: ${metadata.name || metadata.id}`);
      });
      
      // 4. Center the container
      const box = new THREE.Box3().setFromObject(container);
      const pivot = box.getCenter(new THREE.Vector3());
      container.position.sub(pivot);
      
      // 5. Apply global scale
      container.scale.setScalar(scale);
      
      console.log('Model recentered and scaled:', { 
        pivot: { x: pivot.x.toFixed(2), y: pivot.y.toFixed(2), z: pivot.z.toFixed(2) },
        scale: scale,
        units: projectUnits
      });
      
      // Add everything to the scene
      scene.add(container);

       
       // Store metadata and object references for management
       const meshes = Object.values(objectsById).map(obj => obj.mesh);
       container.userData.isLoadedModel = true;
       container.userData.objectsById = objectsById;
       container.userData.detachedMeshes = meshes;
       container.userData.meshCount = meshes.length;
       container.userData.projectUnits = projectUnits;
       container.userData.scale = scale;

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

      console.log(`Added container with ${meshes.length} mesh objects to scene`);
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
      // Remove model from scene
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
          // Remove model from scene
          if (scene) scene.remove(model.object);
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