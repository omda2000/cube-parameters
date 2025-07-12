
import { useRef, useCallback, useState, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { LoadedModel } from '../types/model';

export const useFBXLoader = (scene: THREE.Scene | null) => {
  const loaderRef = useRef<FBXLoader | null>(null);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeLoadingRef = useRef<AbortController | null>(null);

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

  const mergeGeometries = useCallback(async (object: THREE.Object3D): Promise<THREE.Object3D> => {
    try {
      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [];
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          // Clone geometry to avoid modifying original
          const clonedGeometry = child.geometry.clone();
          
          // Apply the mesh's transformation to the geometry
          clonedGeometry.applyMatrix4(child.matrixWorld);
          
          geometries.push(clonedGeometry);
          
          // Collect unique materials
          if (Array.isArray(child.material)) {
            materials.push(...child.material);
          } else {
            materials.push(child.material);
          }
        }
      });

      if (geometries.length === 0) {
        console.warn('No geometries found to merge');
        return object;
      }

      // Merge all geometries into one
      let mergedGeometry: THREE.BufferGeometry;
      
      try {
        const { mergeGeometries: mergeGeometriesUtil } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
        const merged = mergeGeometriesUtil(geometries);
        if (merged) {
          mergedGeometry = merged;
        } else {
          throw new Error('BufferGeometryUtils merge failed');
        }
      } catch (error) {
        console.warn('BufferGeometryUtils not available or failed, using basic merge:', error);
        // Basic merge fallback
        mergedGeometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];
        
        geometries.forEach(geometry => {
          const posAttr = geometry.getAttribute('position');
          const normAttr = geometry.getAttribute('normal');
          const uvAttr = geometry.getAttribute('uv');
          
          if (posAttr) positions.push(...Array.from(posAttr.array));
          if (normAttr) normals.push(...Array.from(normAttr.array));
          if (uvAttr) uvs.push(...Array.from(uvAttr.array));
        });
        
        if (positions.length > 0) {
          mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        }
        if (normals.length > 0) {
          mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        }
        if (uvs.length > 0) {
          mergedGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        }
      }

      // Compute normals if they don't exist
      if (!mergedGeometry.getAttribute('normal')) {
        mergedGeometry.computeVertexNormals();
      }

      // Create a single material (use the first non-basic material found)
      let finalMaterial = materials.find(mat => !(mat instanceof THREE.MeshBasicMaterial)) || materials[0];
      
      if (!finalMaterial) {
        finalMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
      } else if (finalMaterial instanceof THREE.MeshBasicMaterial) {
        // Convert basic material to phong for better lighting
        finalMaterial = new THREE.MeshPhongMaterial({
          color: finalMaterial.color,
          map: finalMaterial.map
        });
      }

      // Create new merged mesh
      const mergedMesh = new THREE.Mesh(mergedGeometry, finalMaterial);
      mergedMesh.name = object.name || 'Merged Object';
      mergedMesh.castShadow = true;
      mergedMesh.receiveShadow = true;

      // Clean up original geometries to prevent memory leaks
      geometries.forEach(geo => {
        try {
          geo.dispose();
        } catch (error) {
          console.warn('Error disposing geometry:', error);
        }
      });

      return mergedMesh;
    } catch (error) {
      console.error('Error in mergeGeometries:', error);
      return object;
    }
  }, []);

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('Starting FBX load process:', file.name);
    
    if (!scene) {
      console.error('Scene not available for FBX loading');
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
      if (!file.name.toLowerCase().endsWith('.fbx')) {
        throw new Error('Invalid file format. Please select an FBX file.');
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File too large. Please select a file smaller than 50MB.');
      }

      if (!loaderRef.current) {
        loaderRef.current = new FBXLoader();
        console.log('FBX loader initialized');
      }

      console.log('Reading file as array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if operation was aborted
      if (abortController.signal.aborted) {
        console.log('FBX loading aborted');
        return;
      }
      
      console.log('Parsing FBX data...');
      const object = loaderRef.current.parse(arrayBuffer, '');
      
      // Check if operation was aborted after parsing
      if (abortController.signal.aborted) {
        console.log('FBX loading aborted after parsing');
        disposeObject(object);
        return;
      }
      
      console.log('FBX parsed successfully:', object);
      
      // Fix Z-axis orientation - most FBX files are Y-up, convert to Z-up
      object.rotateX(-Math.PI / 2);

      // Update world matrix before merging
      object.updateMatrixWorld(true);

      // Merge geometries to create unified object
      console.log('Merging geometries...');
      const mergedObject = await mergeGeometries(object);
      
      // Check if operation was aborted after merging
      if (abortController.signal.aborted) {
        console.log('FBX loading aborted after merging');
        disposeObject(mergedObject);
        return;
      }
      
      // Calculate bounding box after merging
      const boundingBox = new THREE.Box3().setFromObject(mergedObject);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());
      const minY = boundingBox.min.y;

      // Position the model so its bottom center is at origin (0,0,0)
      mergedObject.position.set(-center.x, -minY, -center.z);
      console.log('Model positioned with bottom center at origin');

      // Scale model to fit in view (max size of 4 units)
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 4 ? 4 / maxDimension : 1;
      mergedObject.scale.setScalar(scale);

      // Ensure shadows are enabled
      mergedObject.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Create a Group to ensure proper typing
      const modelGroup = new THREE.Group();
      modelGroup.add(mergedObject);
      modelGroup.name = file.name.replace('.fbx', '');
      
      // Mark as loaded model for proper selection handling
      modelGroup.userData.isLoadedModel = true;
      
      // Mark all children as part of this loaded model
      modelGroup.traverse((child) => {
        if (child !== modelGroup) {
          child.userData.isPartOfLoadedModel = true;
          child.userData.loadedModelRoot = modelGroup;
        }
      });

      const modelData: LoadedModel = {
        id: Date.now().toString(),
        name: file.name.replace('.fbx', ''),
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

      console.log('Adding merged model to scene');
      scene.add(modelGroup);
      setLoadedModels(prev => [...prev, modelData]);
      setCurrentModel(modelData);
      
      // Dispose original object to free memory
      if (object !== mergedObject) {
        disposeObject(object);
      }
      
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error('Failed to load FBX model:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
        setError(errorMessage);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
      activeLoadingRef.current = null;
    }
  }, [scene, currentModel, mergeGeometries, disposeObject]);

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
    loadFBXModel,
    switchToModel,
    removeModel
  };
};
