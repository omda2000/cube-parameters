
import { Settings, Tag, Palette, Ruler, Sliders, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import { MaterialType, MaterialParameters } from '../../../hooks/utils/enhancedMaterialManager';
import { useMaterialManager } from '../../../hooks/useMaterialManager';
import * as THREE from 'three';
import { useState } from 'react';

const PropertiesTab = () => {
  const { selectedObject } = useSelectionContext();
  const { materialManager, updateObjectMaterial, getObjectMaterialState } = useMaterialManager();
  const [isEditingObjectName, setIsEditingObjectName] = useState(false);
  const [isEditingMaterialName, setIsEditingMaterialName] = useState(false);

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject && property === 'name') {
      selectedObject.object.name = value;
      // Update the selected object name in context as well
      selectedObject.name = value;
      console.log(`Object name changed: ${value}`);
    }
  };

  const handleMaterialNameChange = (newName: string) => {
    if (selectedObject && selectedObject.object instanceof THREE.Mesh) {
      const material = Array.isArray(selectedObject.object.material) 
        ? selectedObject.object.material[0] 
        : selectedObject.object.material;
      
      if (material) {
        material.name = newName;
        console.log(`Material name changed: ${newName}`);
      }
    }
    setIsEditingMaterialName(false);
  };

  const handleMaterialTypeChange = (type: MaterialType) => {
    if (selectedObject && materialManager) {
      materialManager.setMaterialType(selectedObject.object, type);
    }
  };

  const handleParameterChange = (parameter: keyof MaterialParameters, value: number) => {
    if (selectedObject && materialManager) {
      materialManager.updateMaterialParameters(selectedObject.object, { [parameter]: value });
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

  const currentMaterialState = selectedObject ? getObjectMaterialState(selectedObject.object) : null;

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
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Object Name</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-auto"
                    onClick={() => setIsEditingObjectName(!isEditingObjectName)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                {isEditingObjectName ? (
                  <Input
                    value={selectedObject.name}
                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                    onBlur={() => setIsEditingObjectName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingObjectName(false)}
                    className="h-7 text-xs"
                    placeholder="Object name"
                    autoFocus
                  />
                ) : (
                  <div 
                    className="h-7 px-3 py-1 text-xs border rounded-md bg-slate-700/50 cursor-pointer flex items-center"
                    onClick={() => setIsEditingObjectName(true)}
                  >
                    {selectedObject.name || 'Unnamed Object'}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to edit object name</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* GLB Object Data Section - Enhanced display */}
        {selectedObject.object.userData && (
          <>
            <Separator className="bg-slate-600" />
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Settings className="h-3 w-3 text-green-400" />
                <Label className="text-xs text-slate-700 dark:text-slate-300">GLB Object Data</Label>
              </div>
              
              {/* ID */}
              {selectedObject.object.userData.id && (
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">ID</Label>
                  <div className="h-7 px-3 py-1 text-xs border rounded-md bg-slate-700/50 font-mono text-slate-300">
                    {selectedObject.object.userData.id}
                  </div>
                </div>
              )}
              
              {/* Type */}
              {selectedObject.object.userData.type && (
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Type</Label>
                  <div className="h-7 px-3 py-1 text-xs border rounded-md bg-slate-700/50">
                    <span className="inline-flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedObject.object.userData.type === 'room' ? 'bg-blue-400' :
                        selectedObject.object.userData.type === 'plot' ? 'bg-green-400' :
                        selectedObject.object.userData.type === 'building' ? 'bg-orange-400' :
                        selectedObject.object.userData.type === 'subroom' ? 'bg-purple-400' :
                        selectedObject.object.userData.type === 'env_obj' ? 'bg-gray-400' :
                        'bg-slate-400'
                      }`} />
                      {selectedObject.object.userData.type}
                    </span>
                  </div>
                </div>
              )}

              {/* Original Metadata */}
              {selectedObject.object.userData.originalMetadata && (
                <>
                  {selectedObject.object.userData.originalMetadata.name && (
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Original Name</Label>
                      <div className="h-7 px-3 py-1 text-xs border rounded-md bg-slate-700/50">
                        {selectedObject.object.userData.originalMetadata.name}
                      </div>
                    </div>
                  )}
                  
                  {selectedObject.object.userData.originalMetadata.params && 
                   Object.keys(selectedObject.object.userData.originalMetadata.params).length > 0 && (
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Parameters</Label>
                      <div className="max-h-24 overflow-y-auto p-2 text-xs border rounded-md bg-slate-700/50 font-mono">
                        {Object.entries(selectedObject.object.userData.originalMetadata.params).map(([key, value]) => (
                          <div key={key} className="flex justify-between gap-2 py-1">
                            <span className="text-slate-400">{key}:</span>
                            <span className="text-slate-200">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Position Info */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Position</Label>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="px-2 py-1 border rounded bg-slate-700/50 font-mono">
                    X: {selectedObject.object.position.x.toFixed(2)}
                  </div>
                  <div className="px-2 py-1 border rounded bg-slate-700/50 font-mono">
                    Y: {selectedObject.object.position.y.toFixed(2)}
                  </div>
                  <div className="px-2 py-1 border rounded bg-slate-700/50 font-mono">
                    Z: {selectedObject.object.position.z.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
