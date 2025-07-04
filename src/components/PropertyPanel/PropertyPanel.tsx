import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Box, Triangle, Sun, TreePine, MapPin } from 'lucide-react';
import * as THREE from 'three';
import type { SceneObject } from '../../types/model';

interface PropertyPanelProps {
  selectedObject: SceneObject | null;
  onPropertyChange: (property: string, value: unknown) => void;
}

const PropertyPanel = ({ selectedObject, onPropertyChange }: PropertyPanelProps) => {
  if (!selectedObject) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-400" />
          Properties
        </h2>
        <div className="text-center py-8 text-slate-400">
          <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No object selected</p>
          <p className="text-xs">Select an object to view its properties</p>
        </div>
      </div>
    );
  }

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'mesh':
        return <Triangle className="h-5 w-5 text-green-400" />;
      case 'group':
        return <Box className="h-5 w-5 text-blue-400" />;
      case 'primitive':
        return <Box className="h-5 w-5 text-purple-400" />;
      case 'ground':
        return <TreePine className="h-5 w-5 text-brown-400" />;
      case 'light':
        return <Sun className="h-5 w-5 text-yellow-400" />;
      case 'point':
        return <MapPin className="h-5 w-5 text-red-400" />;
      default:
        return <Settings className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMeshInfo = (object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh && object.geometry) {
      const geometry = object.geometry;
      let vertices = 0;
      let faces = 0;

      if (geometry.attributes.position) {
        vertices = geometry.attributes.position.count;
      }
      if (geometry.index) {
        faces = geometry.index.count / 3;
      } else {
        faces = vertices / 3;
      }

      return { vertices, faces: Math.floor(faces) };
    }
    return null;
  };

  const handleTransformChange = (axis: 'x' | 'y' | 'z', property: 'position' | 'rotation' | 'scale', value: number) => {
    if (selectedObject && selectedObject.object) {
      const obj = selectedObject.object;
      
      if (property === 'position' && obj.position) {
        obj.position[axis] = value;
      } else if (property === 'rotation' && obj.rotation) {
        obj.rotation[axis] = value;
      } else if (property === 'scale' && obj.scale) {
        obj.scale[axis] = value;
      }
      
      onPropertyChange(`${property}.${axis}`, value);
    }
  };

  const meshInfo = getMeshInfo(selectedObject.object);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {getObjectIcon(selectedObject.type)}
        Properties
      </h2>

      <div className="space-y-4">
        {/* Basic Info */}
        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</Label>
          <Input
            value={selectedObject.name}
            onChange={(e) => onPropertyChange('name', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</Label>
          <Input
            value={selectedObject.type}
            readOnly
            className="mt-1 bg-slate-700/50"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">UUID</Label>
          <Input
            value={selectedObject.object.uuid.slice(0, 8) + '...'}
            readOnly
            className="mt-1 bg-slate-700/50 text-xs"
          />
        </div>

        <Separator className="bg-slate-600" />

        {/* Geometry Info - only show for mesh objects */}
        {meshInfo && selectedObject.type === 'mesh' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vertices</Label>
                <Input
                  value={meshInfo.vertices}
                  readOnly
                  className="mt-1 bg-slate-700/50"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Faces</Label>
                <Input
                  value={meshInfo.faces}
                  readOnly
                  className="mt-1 bg-slate-700/50"
                />
              </div>
            </div>
            <Separator className="bg-slate-600" />
          </>
        )}

        {/* Transform Properties */}
        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            {selectedObject.type === 'point' ? 'Coordinates' : 'Position'}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-slate-400">X</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedObject.object.position.x.toFixed(2)}
                onChange={(e) => handleTransformChange('x', 'position', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Y</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedObject.object.position.y.toFixed(2)}
                onChange={(e) => handleTransformChange('y', 'position', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Z</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedObject.object.position.z.toFixed(2)}
                onChange={(e) => handleTransformChange('z', 'position', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Hide rotation and scale for point objects */}
        {selectedObject.type !== 'point' && (
          <>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Rotation (degrees)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-slate-400">X</Label>
                  <Input
                    type="number"
                    step="1"
                    value={(selectedObject.object.rotation.x * 180 / Math.PI).toFixed(1)}
                    onChange={(e) => handleTransformChange('x', 'rotation', parseFloat(e.target.value) * Math.PI / 180)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Y</Label>
                  <Input
                    type="number"
                    step="1"
                    value={(selectedObject.object.rotation.y * 180 / Math.PI).toFixed(1)}
                    onChange={(e) => handleTransformChange('y', 'rotation', parseFloat(e.target.value) * Math.PI / 180)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Z</Label>
                  <Input
                    type="number"
                    step="1"
                    value={(selectedObject.object.rotation.z * 180 / Math.PI).toFixed(1)}
                    onChange={(e) => handleTransformChange('z', 'rotation', parseFloat(e.target.value) * Math.PI / 180)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Scale</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-slate-400">X</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedObject.object.scale.x.toFixed(2)}
                    onChange={(e) => handleTransformChange('x', 'scale', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Y</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedObject.object.scale.y.toFixed(2)}
                    onChange={(e) => handleTransformChange('y', 'scale', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Z</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedObject.object.scale.z.toFixed(2)}
                    onChange={(e) => handleTransformChange('z', 'scale', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
