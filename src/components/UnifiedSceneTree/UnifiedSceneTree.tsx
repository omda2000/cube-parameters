
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
  measurements?: Array<{
    id: string;
    startPoint: { x: number; y: number; z: number };
    endPoint: { x: number; y: number; z: number };
    distance: number;
    label: string;
  }>;
  points?: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    name: string;
  }>;
  onRemoveMeasurement?: (id: string) => void;
  onRemovePoint?: (id: string) => void;
}

const UnifiedSceneTree = ({ 
  loadedModels, 
  currentModel, 
  showPrimitives,
  scene,
  measurements = [],
  points = [],
  onRemoveMeasurement,
  onRemovePoint
}: UnifiedSceneTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'measurements', 'points']));
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

      // Add measurements
      if (measurements.length > 0) {
        const measurementObjects: SceneObject[] = measurements.map(measurement => ({
          id: `measurement_${measurement.id}`,
          name: `${measurement.label} (${measurement.distance.toFixed(2)}u)`,
          type: 'measurement',
          object: new THREE.Object3D(), // Placeholder object
          children: [],
          visible: true,
          selected: selectedObject?.id === `measurement_${measurement.id}`
        }));

        objects.push({
          id: 'measurements',
          name: 'Measurements',
          type: 'group',
          object: new THREE.Object3D(),
          children: measurementObjects,
          visible: true,
          selected: false
        });
      }

      // Add points
      if (points.length > 0) {
        const pointObjects: SceneObject[] = points.map(point => ({
          id: `point_${point.id}`,
          name: `${point.name} (${point.position.x.toFixed(1)}, ${point.position.y.toFixed(1)}, ${point.position.z.toFixed(1)})`,
          type: 'point',
          object: new THREE.Object3D(), // Placeholder object
          children: [],
          visible: true,
          selected: selectedObject?.id === `point_${point.id}`
        }));

        objects.push({
          id: 'points',
          name: 'Points',
          type: 'group',
          object: new THREE.Object3D(),
          children: pointObjects,
          visible: true,
          selected: false
        });
      }

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
  }, [scene, loadedModels, showPrimitives, selectedObject, measurements, points]);

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

  const handleDelete = (sceneObject: SceneObject, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (sceneObject.type === 'measurement' && onRemoveMeasurement) {
      const measurementId = sceneObject.id.replace('measurement_', '');
      onRemoveMeasurement(measurementId);
    } else if (sceneObject.type === 'point' && onRemovePoint) {
      const pointId = sceneObject.id.replace('point_', '');
      onRemovePoint(pointId);
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
        return <MapPin className="h-4 w-4 text-cyan-400" />;
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
    const canDelete = sceneObject.type === 'measurement' || sceneObject.type === 'point';

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
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                  onClick={(e) => handleDelete(sceneObject, e)}
                  title="Delete"
                >
                  <span className="text-xs">×</span>
                </Button>
              )}
              
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
            sceneObjects.map(obj => renderNode(obj))
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSceneTree;
