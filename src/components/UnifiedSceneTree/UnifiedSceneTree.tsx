
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, EyeOff, Box, Triangle, Sun, TreePine, MapPin, Ruler } from 'lucide-react';
import * as THREE from 'three';
import { useSelectionContext } from '../../contexts/SelectionContext';
import type { LoadedModel, SceneObject } from '../../types/model';

interface UnifiedSceneTreeProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  showPrimitives: boolean;
  scene: THREE.Scene | null;
}

const UnifiedSceneTree = ({ 
  loadedModels, 
  currentModel, 
  showPrimitives,
  scene
}: UnifiedSceneTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const { selectedObject, selectObject } = useSelectionContext();

  // Build unified scene tree
  useEffect(() => {
    if (!scene) return;

    const buildSceneObjects = (): SceneObject[] => {
      const objects: SceneObject[] = [];

      // Add loaded models
      loadedModels.forEach(model => {
        const modelObject: SceneObject = {
          id: `model_${model.id}`,
          name: model.name,
          type: 'group',
          object: model.object,
          children: buildChildren(model.object),
          visible: model.object.visible,
          selected: selectedObject?.id === `model_${model.id}`
        };
        objects.push(modelObject);
      });

      // Add primitives if showing
      if (showPrimitives) {
        scene.traverse((object) => {
          if (object.userData.isPrimitive) {
            const primitiveObject: SceneObject = {
              id: `primitive_${object.uuid}`,
              name: object.name || 'Box Primitive',
              type: 'primitive',
              object: object,
              children: [],
              visible: object.visible,
              selected: selectedObject?.id === `primitive_${object.uuid}`
            };
            objects.push(primitiveObject);
          }
        });
      }

      // Add points
      scene.traverse((object) => {
        if (object.userData.isPoint) {
          const pointObject: SceneObject = {
            id: `point_${object.uuid}`,
            name: object.name || `Point (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`,
            type: 'point',
            object: object,
            children: [],
            visible: object.visible,
            selected: selectedObject?.id === `point_${object.uuid}`
          };
          objects.push(pointObject);
        }
      });

      // Add measurement groups
      scene.traverse((object) => {
        if (object.userData.isMeasurementGroup && object instanceof THREE.Group) {
          const measurementData = object.userData.measurementData;
          const distance = measurementData ? measurementData.distance : 0;
          
          const measurementObject: SceneObject = {
            id: `measurement_${object.uuid}`,
            name: `Measurement (${distance.toFixed(3)} units)`,
            type: 'measurement',
            object: object,
            children: [],
            visible: object.visible,
            selected: selectedObject?.id === `measurement_${object.uuid}`,
            measurementData: measurementData ? {
              startPoint: measurementData.startPoint,
              endPoint: measurementData.endPoint,
              distance: measurementData.distance
            } : undefined
          };
          objects.push(measurementObject);
        }
      });

      // Add environment objects
      const groundObject = scene.children.find(child => 
        child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry && child.userData.isHelper
      );
      
      if (groundObject) {
        objects.push({
          id: 'ground',
          name: 'Ground Plane',
          type: 'ground',
          object: groundObject,
          children: [],
          visible: groundObject.visible,
          selected: selectedObject?.id === 'ground'
        });
      }

      return objects;
    };

    const buildChildren = (object: THREE.Object3D): SceneObject[] => {
      return object.children
        .filter(child => !child.userData.isHelper)
        .map(child => ({
          id: `child_${child.uuid}`,
          name: child.name || `${child.type}_${child.uuid.slice(0, 8)}`,
          type: child instanceof THREE.Mesh ? 'mesh' : 'group',
          object: child,
          children: buildChildren(child),
          visible: child.visible,
          selected: selectedObject?.id === `child_${child.uuid}`
        }));
    };

    setSceneObjects(buildSceneObjects());
  }, [scene, loadedModels, showPrimitives, selectedObject]);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleVisibility = (sceneObject: SceneObject) => {
    sceneObject.object.visible = !sceneObject.object.visible;
    setSceneObjects([...sceneObjects]);
  };

  const handleObjectSelect = (sceneObject: SceneObject) => {
    const isCurrentlySelected = selectedObject?.id === sceneObject.id;
    selectObject(isCurrentlySelected ? null : sceneObject);
  };

  const handleDelete = (sceneObject: SceneObject, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (sceneObject.type === 'point' || sceneObject.type === 'measurement') {
      // Remove from scene
      scene?.remove(sceneObject.object);
      
      // Dispose geometry and material for measurement groups
      if (sceneObject.type === 'measurement' && sceneObject.object instanceof THREE.Group) {
        sceneObject.object.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material?.dispose();
            }
          } else if (child instanceof THREE.Line) {
            child.geometry?.dispose();
            (child.material as THREE.Material)?.dispose();
          }
        });
      }
      
      // Dispose geometry and material for points
      if (sceneObject.type === 'point' && sceneObject.object instanceof THREE.Mesh) {
        sceneObject.object.geometry?.dispose();
        if (Array.isArray(sceneObject.object.material)) {
          sceneObject.object.material.forEach(mat => mat.dispose());
        } else {
          sceneObject.object.material?.dispose();
        }
      }
      
      // Clear selection if this object was selected
      if (selectedObject?.id === sceneObject.id) {
        selectObject(null);
      }
      
      // Force re-render
      setSceneObjects([...sceneObjects]);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'mesh':
        return <Triangle className="h-4 w-4 text-green-400" />;
      case 'group':
        return <Box className="h-4 w-4 text-blue-400" />;
      case 'primitive':
        return <Box className="h-4 w-4 text-purple-400" />;
      case 'ground':
        return <TreePine className="h-4 w-4 text-brown-400" />;
      case 'light':
        return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'point':
        return <MapPin className="h-4 w-4 text-red-400" />;
      case 'measurement':
        return <Ruler className="h-4 w-4 text-orange-400" />;
      default:
        return <Box className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderNode = (sceneObject: SceneObject, level = 0) => {
    const isExpanded = expandedNodes.has(sceneObject.id);
    const hasChildren = sceneObject.children.length > 0;
    const paddingLeft = level * 16;
    const isSelected = selectedObject?.id === sceneObject.id;
    const isDeletable = sceneObject.type === 'point' || sceneObject.type === 'measurement';

    return (
      <div key={sceneObject.id}>
        <div 
          className={`flex items-center py-1 px-2 hover:bg-slate-700/30 rounded text-sm cursor-pointer ${
            isSelected ? 'bg-blue-600/30 border border-blue-500/50' : ''
          }`}
          style={{ paddingLeft }}
          onClick={() => handleObjectSelect(sceneObject)}
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(sceneObject.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            
            {getNodeIcon(sceneObject.type)}
            
            <span className={`truncate flex-1 ${isSelected ? 'text-blue-300 font-medium' : 'text-slate-200'}`}>
              {sceneObject.name}
            </span>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(sceneObject);
                }}
              >
                {sceneObject.object.visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
              
              {isDeletable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                  onClick={(e) => handleDelete(sceneObject, e)}
                  title="Delete"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {sceneObject.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Group objects by type for better organization
  const groupedObjects = {
    models: sceneObjects.filter(obj => obj.type === 'group'),
    primitives: sceneObjects.filter(obj => obj.type === 'primitive'),
    points: sceneObjects.filter(obj => obj.type === 'point'),
    measurements: sceneObjects.filter(obj => obj.type === 'measurement'),
    environment: sceneObjects.filter(obj => obj.type === 'ground')
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        <Box className="h-4 w-4" />
        Scene Hierarchy
      </div>
      <div className="max-h-96 overflow-y-auto border border-slate-600 rounded bg-slate-800/30">
        <div className="p-2">
          {sceneObjects.length === 0 ? (
            <div className="text-center py-4 text-slate-400">
              <Box className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No objects in scene</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Models */}
              {groupedObjects.models.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 px-2">
                    Models ({groupedObjects.models.length})
                  </div>
                  {groupedObjects.models.map(obj => renderNode(obj))}
                </div>
              )}
              
              {/* Primitives */}
              {groupedObjects.primitives.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 px-2">
                    Primitives ({groupedObjects.primitives.length})
                  </div>
                  {groupedObjects.primitives.map(obj => renderNode(obj))}
                </div>
              )}
              
              {/* Points */}
              {groupedObjects.points.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 px-2">
                    Points ({groupedObjects.points.length})
                  </div>
                  {groupedObjects.points.map(obj => renderNode(obj))}
                </div>
              )}
              
              {/* Measurements */}
              {groupedObjects.measurements.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 px-2">
                    Measurements ({groupedObjects.measurements.length})
                  </div>
                  {groupedObjects.measurements.map(obj => renderNode(obj))}
                </div>
              )}
              
              {/* Environment */}
              {groupedObjects.environment.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 px-2">
                    Environment
                  </div>
                  {groupedObjects.environment.map(obj => renderNode(obj))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSceneTree;
