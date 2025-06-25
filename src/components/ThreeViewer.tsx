
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useLighting } from '../hooks/useLighting';
import { useEnvironment } from '../hooks/useEnvironment';
import { useFBXLoader } from '../hooks/useFBXLoader';
import { useSelectionContext } from '../contexts/SelectionContext';
import { useSelectionEffects } from '../hooks/useSelectionEffects';
import ObjectDataOverlay from './ObjectDataOverlay';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality,
  SceneObject
} from '../types/model';

interface ThreeViewerProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  showPrimitives?: boolean;
}

const ThreeViewer = ({ 
  dimensions, 
  boxColor, 
  objectName, 
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  onModelsChange,
  onSceneReady,
  showPrimitives = true
}: ThreeViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectObject, selectedObject, clearSelection } = useSelectionContext();

  const {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef
  } = useThreeScene(mountRef);

  // Expose scene to parent components
  useEffect(() => {
    if (sceneRef.current && onSceneReady) {
      onSceneReady(sceneRef.current);
    }
  }, [sceneRef.current, onSceneReady]);

  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    true // Always show the primitive box
  );

  // Mark box as primitive for scene tree
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.userData.isPrimitive = true;
    }
  }, [boxRef.current]);

  const {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  } = useFBXLoader(sceneRef.current);

  // Expose models to parent component
  useEffect(() => {
    if (onModelsChange) {
      onModelsChange(loadedModels, currentModel);
    }
  }, [loadedModels, currentModel, onModelsChange]);

  // Expose FBX handlers globally for parent components to access
  useEffect(() => {
    (window as any).__fbxUploadHandler = loadFBXModel;
    (window as any).__fbxSwitchHandler = switchToModel;
    (window as any).__fbxRemoveHandler = removeModel;

    return () => {
      delete (window as any).__fbxUploadHandler;
      delete (window as any).__fbxSwitchHandler;
      delete (window as any).__fbxRemoveHandler;
    };
  }, [loadFBXModel, switchToModel, removeModel]);

  // Handle object selection from 3D viewport
  const handleObjectSelect = React.useCallback((object: THREE.Object3D | null) => {
    if (object) {
      const sceneObject: SceneObject = {
        id: object.userData.isPrimitive ? `primitive_${object.uuid}` : `object_${object.uuid}`,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.userData.isPrimitive ? 'primitive' : 'mesh',
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      selectObject(sceneObject);
    } else {
      clearSelection();
    }
  }, [selectObject, clearSelection]);

  // Use selection effects hook for visual feedback
  useSelectionEffects(selectedObject);

  // Mouse interaction and hover effects
  const { objectData, mousePosition, isHovering } = useMouseInteraction(
    rendererRef.current,
    cameraRef.current,
    currentModel ? currentModel.object : boxRef.current,
    sceneRef.current,
    handleObjectSelect
  );

  useLighting(
    sceneRef.current,
    sunlight,
    ambientLight,
    shadowQuality
  );

  useEnvironment(
    sceneRef.current,
    environment,
    gridHelperRef.current
  );

  // Expose zoom controls to parent
  useEffect(() => {
    const zoomControls = {
      zoomAll: () => {
        if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
        
        const allObjects: THREE.Object3D[] = [];
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            allObjects.push(object);
          }
        });
        
        if (allObjects.length === 0) return;
        
        const box = new THREE.Box3();
        allObjects.forEach(obj => {
          if (obj.visible) {
            const objBox = new THREE.Box3().setFromObject(obj);
            box.union(objBox);
          }
        });
        
        if (box.isEmpty()) return;
        
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim / (2 * Math.tan((cameraRef.current.fov * Math.PI) / 360)) * 1.5;
        
        const targetPosition = center.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance));
        
        // Smooth transition
        const startPosition = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easedProgress);
          controlsRef.current!.target.lerpVectors(startTarget, center, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      },
      
      zoomToSelected: () => {
        if (!selectedObject || !cameraRef.current || !controlsRef.current) return;
        
        const object = selectedObject.object;
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim / (2 * Math.tan((cameraRef.current.fov * Math.PI) / 360)) * 2;
        
        const targetPosition = center.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance));
        
        // Smooth transition
        const startPosition = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easedProgress);
          controlsRef.current!.target.lerpVectors(startTarget, center, easedProgress);
          controlsRef.current!.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      }
    };

    (window as any).__zoomControls = zoomControls;

    return () => {
      delete (window as any).__zoomControls;
    };
  }, [selectedObject, sceneRef.current, cameraRef.current, controlsRef.current]);

  // Handle keyboard shortcuts for selection and zoom
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSelection();
        event.preventDefault();
      } else if (event.key === 'a' || event.key === 'A') {
        const zoomControls = (window as any).__zoomControls;
        if (zoomControls) {
          zoomControls.zoomAll();
          event.preventDefault();
        }
      } else if (event.key === 'f' || event.key === 'F') {
        const zoomControls = (window as any).__zoomControls;
        if (zoomControls && selectedObject) {
          zoomControls.zoomToSelected();
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearSelection, selectedObject]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      <ObjectDataOverlay 
        objectData={objectData}
        mousePosition={mousePosition}
        visible={isHovering}
      />
      
      {/* Selection info overlay */}
      {selectedObject && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Selected:</span>
            <span className="text-blue-300">{selectedObject.name}</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Press ESC to deselect • F to focus
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeViewer;
