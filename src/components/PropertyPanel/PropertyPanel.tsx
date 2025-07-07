
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Box, Triangle, Sun, TreePine, MapPin } from 'lucide-react';
import * as THREE from 'three';
import type { SceneObject } from '../../types/model';

interface PropertyPanelProps {
  selectedObject: SceneObject | null;
  onPropertyChange: (property: string, value: any) => void;
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

  const getMaterialName = (object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh && object.material) {
      if (Array.isArray(object.material)) {
        return object.material.map(mat => mat.name || mat.type).join(', ');
      }
      return object.material.name || object.material.type;
    }
    return 'No material';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {getObjectIcon(selectedObject.type)}
        Properties
      </h2>

      <div className="space-y-4">
        {/* Object Name */}
        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</Label>
          <Input
            value={selectedObject.name}
            onChange={(e) => onPropertyChange('name', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Material - only show for mesh objects */}
        {selectedObject.type === 'mesh' && (
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Material</Label>
            <Input
              value={getMaterialName(selectedObject.object)}
              readOnly
              className="mt-1 bg-slate-700/50"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
