
import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { LoadedModel } from '../types/model';

export const useFBXLoader = (scene: THREE.Scene | null) => {
  const loaderRef = useRef<FBXLoader | null>(null);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergeGeometries = useCallback(async (object: THREE.Object3D): Promise<THREE.Object3D> => {
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

    if (geometries.length === 0) return object;

    // Merge all geometries into one
    const mergedGeometry = new THREE.BufferGeometry();
    
    // Merge geometries using BufferGeometryUtils if available, otherwise use basic merge
    try {
      const { mergeGeometries: mergeGeometriesUtil } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
      const merged = mergeGeometriesUtil(geometries);
      if (merged) {
        mergedGeometry.copy(merged);
      }
    } catch (error) {
      console.warn('BufferGeometryUtils not available, using basic merge');
      // Basic merge - combine position, normal, and uv attributes
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
      
      mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
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

    // Clean up original geometries
    geometries.forEach(geo => geo.dispose());

    return mergedMesh;
  }, []);

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('Starting FBX load process:', file.name);
    
    if (!scene) {
      console.error('Scene not available for FBX loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!loaderRef.current) {
        loaderRef.current = new FBXLoader();
        console.log('FBX loader initialized');
      }

      console.log('Reading file as array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      
      console.log('Parsing FBX data...');
      const object = loaderRef.current.parse(arrayBuffer, '');
      console.log('FBX parsed successfully:', object);
      
      // Fix Z-axis orientation - most FBX files are Y-up, convert to Z-up
      object.rotateX(-Math.PI / 2);

      // Update world matrix before merging
      object.updateMatrixWorld(true);

      // Merge geometries to create unified object
      console.log('Merging geometries...');
      const mergedObject = await mergeGeometries(object);
      
      // Calculate bounding box after merging
      const boundingBox = new THREE.Box3().setFromObject(mergedObject);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      // Center the model at origin
      mergedObject.position.sub(center);

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
      }

      console.log('Adding merged model to scene');
      scene.add(modelGroup);
      setLoadedModels(prev => [...prev, modelData]);
      setCurrentModel(modelData);
      
    } catch (err) {
      console.error('Failed to load FBX model:', err);
      setError('Failed to load model. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  }, [scene, currentModel, mergeGeometries]);

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
