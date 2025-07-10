
import { Settings, Tag, Palette, Ruler, Sliders } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import { MaterialType, MaterialParameters } from '../../../hooks/utils/enhancedMaterialManager';
import { useMaterialManager } from '../../../hooks/useMaterialManager';
import * as THREE from 'three';

const PropertiesTab = () => {
  const { selectedObject } = useSelectionContext();
  const { materialManager, updateObjectMaterial, getObjectMaterialState } = useMaterialManager();

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject && property === 'name') {
      selectedObject.name = value;
      console.log(`Property changed: ${property} = ${value}`);
    }
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

        <Separator className="bg-slate-600" />

        {/* Material Selection */}
        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-1">
              <Palette className="h-3 w-3 text-pink-400" />
              Material Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select
              value={currentMaterialState?.type || 'default'}
              onValueChange={handleMaterialTypeChange}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="matPaint">Mat Paint</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Material Parameters */}
        {currentMaterialState && currentMaterialState.type !== 'default' && (
          <Card className="bg-slate-700/30 border-slate-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-1">
                <Sliders className="h-3 w-3 text-cyan-400" />
                Material Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {/* Diffusion */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Diffusion: {currentMaterialState.parameters.diffusion.toFixed(2)}</Label>
                <Slider
                  value={[currentMaterialState.parameters.diffusion]}
                  onValueChange={([value]) => handleParameterChange('diffusion', value)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="h-2"
                />
              </div>

              {/* Opacity */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Opacity: {currentMaterialState.parameters.opacity.toFixed(2)}</Label>
                <Slider
                  value={[currentMaterialState.parameters.opacity]}
                  onValueChange={([value]) => handleParameterChange('opacity', value)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="h-2"
                />
              </div>

              {/* Reflection */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Reflection: {currentMaterialState.parameters.reflection.toFixed(2)}</Label>
                <Slider
                  value={[currentMaterialState.parameters.reflection]}
                  onValueChange={([value]) => handleParameterChange('reflection', value)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="h-2"
                />
              </div>

              {/* Refraction (only for glass) */}
              {currentMaterialState.type === 'glass' && (
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Refraction: {currentMaterialState.parameters.refraction.toFixed(2)}</Label>
                  <Slider
                    value={[currentMaterialState.parameters.refraction]}
                    onValueChange={([value]) => handleParameterChange('refraction', value)}
                    max={2}
                    min={1}
                    step={0.01}
                    className="h-2"
                  />
                </div>
              )}

              {/* Edge */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Edge: {currentMaterialState.parameters.edge.toFixed(2)}</Label>
                <Slider
                  value={[currentMaterialState.parameters.edge]}
                  onValueChange={([value]) => handleParameterChange('edge', value)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="h-2"
                />
              </div>

              {/* Thickness (for glass and translucent materials) */}
              {(currentMaterialState.type === 'glass' || currentMaterialState.type === 'plastic') && (
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Thickness: {currentMaterialState.parameters.thickness.toFixed(1)}</Label>
                  <Slider
                    value={[currentMaterialState.parameters.thickness]}
                    onValueChange={([value]) => handleParameterChange('thickness', value)}
                    max={10}
                    min={0}
                    step={0.1}
                    className="h-2"
                  />
                </div>
              )}

              {/* Edge Line Pipe */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Edge Line: {currentMaterialState.parameters.edgeLinePipe.toFixed(2)}</Label>
                <Slider
                  value={[currentMaterialState.parameters.edgeLinePipe]}
                  onValueChange={([value]) => handleParameterChange('edgeLinePipe', value)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Material Info */}
        {selectedObject.type === 'mesh' && (
          <>
            <Separator className="bg-slate-600" />
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Palette className="h-3 w-3 text-pink-400" />
                      <Label className="text-xs text-slate-700 dark:text-slate-300">Current Material</Label>
                    </div>
                    <Input
                      value={getMaterialName(selectedObject.object)}
                      readOnly
                      className="h-7 text-xs bg-slate-700/50"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current Material Type</p>
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
