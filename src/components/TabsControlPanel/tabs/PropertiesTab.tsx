
import { Settings, Tag, Palette, Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Name</Label>
                </div>
                <Input
                  value={selectedObject.name}
                  onChange={(e) => handlePropertyChange('name', e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Object name"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Object Name</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Material - only show for mesh objects */}
        {selectedObject.type === 'mesh' && (
          <>
            <Separator className="bg-slate-600" />
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Palette className="h-3 w-3 text-pink-400" />
                      <Label className="text-xs text-slate-700 dark:text-slate-300">Material</Label>
                    </div>
                    <Input
                      value={getMaterialName(selectedObject.object)}
                      readOnly
                      className="h-7 text-xs bg-slate-700/50"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Material Type</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}

        {/* Show additional properties for primitive objects */}
        {selectedObject.type === 'primitive' && (
          <>
            <Separator className="bg-slate-600" />
            
            {/* Color picker for primitives */}
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Palette className="h-3 w-3 text-pink-400" />
                      <Label className="text-xs text-slate-700 dark:text-slate-300">Color</Label>
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="color"
                        defaultValue="#00ff00"
                        className="w-8 h-7 rounded border border-slate-600 bg-transparent"
                      />
                      <Input
                        defaultValue="#00ff00"
                        className="h-7 text-xs flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Material Color</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Dimensions for primitives */}
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Ruler className="h-3 w-3 text-cyan-400" />
                      <Label className="text-xs text-slate-700 dark:text-slate-300">Dimensions</Label>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <Input
                        type="number"
                        defaultValue={1}
                        className="h-7 text-xs"
                        placeholder="L"
                      />
                      <Input
                        type="number"
                        defaultValue={1}
                        className="h-7 text-xs"
                        placeholder="W"
                      />
                      <Input
                        type="number"
                        defaultValue={1}
                        className="h-7 text-xs"
                        placeholder="H"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Object Dimensions (L, W, H)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
