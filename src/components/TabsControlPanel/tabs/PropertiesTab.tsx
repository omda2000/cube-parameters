
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

  // Try to parse metadata from name if it exists and userData is empty
  const parseMetadataFromName = (object: THREE.Object3D) => {
    if (object.name && (!object.userData || Object.keys(object.userData).length === 0)) {
      try {
        return JSON.parse(object.name);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const metadataFromName = parseMetadataFromName(selectedObject.object);
  const hasMetadata = selectedObject.object.userData && Object.keys(selectedObject.object.userData).length > 0;
  const hasNameMetadata = metadataFromName !== null;

  return (
    <TooltipProvider>
      <div className="space-y-4 p-3">
        {/* Properties Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Properties</span>
          </div>

          {/* Object Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3 text-slate-400" />
              <Label className="text-xs text-slate-400">Object Name</Label>
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
                className="h-8 text-sm bg-slate-800/60 border-slate-600 text-slate-200"
                placeholder="Object name"
                autoFocus
              />
            ) : (
              <div 
                className="h-8 px-3 py-1 text-sm border border-slate-600 rounded-md bg-slate-800/60 cursor-pointer flex items-center text-slate-200"
                onClick={() => setIsEditingObjectName(true)}
              >
                {selectedObject.name || metadataFromName?.id || 'Unnamed Object'}
              </div>
            )}
          </div>
        </div>

        {/* GLB Object Data Section */}
        {(hasMetadata || hasNameMetadata) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-green-400" />
              <Label className="text-sm text-slate-300">GLB Object Data</Label>
            </div>
            
            {/* ID */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">ID</Label>
              <div className="h-8 px-3 py-1 text-sm border border-slate-600 rounded-md bg-slate-800/60 font-mono text-slate-200">
                {selectedObject.object.userData?.id || metadataFromName?.id || 'N/A'}
              </div>
            </div>
            
            {/* Type */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Type</Label>
              <div className="h-8 px-3 py-1 text-sm border border-slate-600 rounded-md bg-slate-800/60 flex items-center text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (selectedObject.object.userData?.type || metadataFromName?.type) === 'room' ? 'bg-blue-400' :
                    (selectedObject.object.userData?.type || metadataFromName?.type) === 'plot' ? 'bg-green-400' :
                    (selectedObject.object.userData?.type || metadataFromName?.type) === 'building' ? 'bg-orange-400' :
                    (selectedObject.object.userData?.type || metadataFromName?.type) === 'subroom' ? 'bg-purple-400' :
                    (selectedObject.object.userData?.type || metadataFromName?.type) === 'env_obj' ? 'bg-gray-400' :
                    'bg-slate-400'
                  }`} />
                  {selectedObject.object.userData?.type || metadataFromName?.type || 'unknown'}
                </span>
              </div>
            </div>

            {/* Original Name - Show the full JSON or parsed name */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Original Name</Label>
              <div className="min-h-8 px-3 py-2 text-xs border border-slate-600 rounded-md bg-slate-800/60 font-mono text-slate-200 break-all">
                {selectedObject.object.userData?.originalMetadata?.name || 
                 (hasNameMetadata ? selectedObject.object.name : 'N/A')}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Position</Label>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="px-3 py-1 border border-slate-600 rounded bg-slate-800/60 font-mono text-slate-200">
                  X: {selectedObject.object.position.x.toFixed(2)}
                </div>
                <div className="px-3 py-1 border border-slate-600 rounded bg-slate-800/60 font-mono text-slate-200">
                  Y: {selectedObject.object.position.y.toFixed(2)}
                </div>
                <div className="px-3 py-1 border border-slate-600 rounded bg-slate-800/60 font-mono text-slate-200">
                  Z: {selectedObject.object.position.z.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
