
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, EyeOff, Box, Triangle, Sun, TreePine, MapPin, Ruler } from 'lucide-react';
import * as THREE from 'three';
import { useSelectionContext } from '../../contexts/SelectionContext';
import type { LoadedModel, SceneObject } from '../../types/model';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

interface UnifiedSceneTreeProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  showPrimitives: boolean;
  scene: THREE.Scene | null;
  measurements?: MeasureData[];
  onRemoveMeasurement?: (id: string) => void;
}

const UnifiedSceneTree = ({ 
  loadedModels, 
  currentModel, 
  showPrimitives,
  scene,
  measurements = [],
  onRemoveMeasurement
}: UnifiedSceneTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'models', 'measurements', 'points']));
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [points, setPoints] = useState<Array<{ id: string; position: { x: number; y: number; z: number } }>>([]);
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

    // Extract points from scene
    const scenePoints: Array<{ id: string; position: { x: number; y: number; z: number } }> = [];
    scene.traverse((object) => {
      if (object.userData.isPoint) {
        scenePoints.push({
          id: object.uuid,
          position: { x: object.position.x, y: object.position.y, z: object.position.z }
        });
      }
    });
    setPoints(scenePoints);

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
        return <MapPin className="h-4 w-4 text-orange-400" />;
      case 'measurement':
        return <Ruler className="h-4 w-4 text-cyan-400" />;
      default:
        return <Box className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderNode = (sceneObject: SceneObject, level = 0) => {
    const isExpanded = expandedNodes.has(sceneObject.id);
    const hasChildren = sceneObject.children.length > 0;
    const paddingLeft = level * 16;
    const isSelected = selectedObject?.id === sceneObject.id;

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
        
        {hasChildren && isExpanded && (
          <div>
            {sceneObject.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, sectionKey: string, children: React.ReactNode) => {
    const isExpanded = expandedNodes.has(sectionKey);
    
    return (
      <div>
        <div 
          className="flex items-center py-2 px-2 hover:bg-slate-700/20 rounded text-sm cursor-pointer border-b border-slate-600/30"
          onClick={() => toggleExpanded(sectionKey)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          {icon}
          <span className="text-slate-300 font-medium ml-2">{title}</span>
        </div>
        {isExpanded && <div className="ml-2">{children}</div>}
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
        <div className="p-2 space-y-2">
          {/* Models Section */}
          {renderSection(
            `Models (${sceneObjects.length})`,
            <Box className="h-4 w-4 text-blue-400" />,
            'models',
            sceneObjects.length === 0 ? (
              <div className="text-center py-4 text-slate-400">
                <Box className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No objects in scene</p>
              </div>
            ) : (
              sceneObjects.map(obj => renderNode(obj))
            )
          )}

          {/* Points Section */}
          {renderSection(
            `Points (${points.length})`,
            <MapPin className="h-4 w-4 text-orange-400" />,
            'points',
            points.length === 0 ? (
              <div className="text-center py-4 text-slate-400">
                <MapPin className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No points created</p>
              </div>
            ) : (
              points.map(point => (
                <div key={point.id} className="flex items-center py-1 px-2 hover:bg-slate-700/30 rounded text-sm">
                  <MapPin className="h-4 w-4 text-orange-400 mr-2" />
                  <span className="text-slate-200 flex-1">
                    Point ({point.position.x.toFixed(2)}, {point.position.y.toFixed(2)}, {point.position.z.toFixed(2)})
                  </span>
                </div>
              ))
            )
          )}

          {/* Measurements Section */}
          {renderSection(
            `Measurements (${measurements.length})`,
            <Ruler className="h-4 w-4 text-cyan-400" />,
            'measurements',
            measurements.length === 0 ? (
              <div className="text-center py-4 text-slate-400">
                <Ruler className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No measurements created</p>
              </div>
            ) : (
              measurements.map(measurement => (
                <div key={measurement.id} className="flex items-center py-1 px-2 hover:bg-slate-700/30 rounded text-sm">
                  <Ruler className="h-4 w-4 text-cyan-400 mr-2" />
                  <div className="flex-1">
                    <div className="text-slate-200">{measurement.label}</div>
                    <div className="text-xs text-slate-400">Distance: {measurement.distance.toFixed(3)} units</div>
                  </div>
                  {onRemoveMeasurement && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                      onClick={() => onRemoveMeasurement(measurement.id)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSceneTree;
