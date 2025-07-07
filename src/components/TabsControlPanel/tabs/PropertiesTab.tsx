
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import * as THREE from 'three';

const PropertiesTab = () => {
  const { selectedObject } = useSelectionContext();

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject && property === 'name') {
      selectedObject.name = value;
      console.log(`Property changed: ${property} = ${value}`);
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

  if (!selectedObject) {
    return (
      <TooltipProvider>
        <div className="p-2 text-center">
          <Settings className="h-6 w-6 mx-auto mb-1 opacity-50 text-slate-400" />
          <p className="text-xs text-slate-400">No Selection</p>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3 p-2">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Settings className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Properties</span>
        </div>

        {/* Object name */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-700 dark:text-slate-300">Name</Label>
          <Input
            value={selectedObject.name}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
            className="h-7 text-xs"
            placeholder="Object name"
          />
        </div>

        {/* Material - only show for mesh objects */}
        {selectedObject.type === 'mesh' && (
          <div className="space-y-1">
            <Label className="text-xs text-slate-700 dark:text-slate-300">Material</Label>
            <Input
              value={getMaterialName(selectedObject.object)}
              readOnly
              className="h-7 text-xs bg-slate-700/50"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
