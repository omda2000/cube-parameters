
import React, { memo, useCallback, useMemo } from 'react';
import { Box, Palette, Tag, Ruler, Sparkles, Eye, Globe, Droplets, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useMaterialProperties } from '../../../hooks/useMaterialProperties';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import type { BoxDimensions } from '../../../types/model';

interface PropertiesTabProps {
  dimensions: BoxDimensions;
  setDimensions: (dimensions: BoxDimensions) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
}

const PropertiesTab = memo(({
  dimensions,
  setDimensions,
  boxColor,
  setBoxColor,
  objectName,
  setObjectName
}: PropertiesTabProps) => {
  const { selectedObjects } = useSelectionContext();
  const { materialProps, updateMaterialProperty } = useMaterialProperties(selectedObjects);

  // Memoize selection state to prevent unnecessary re-renders
  const selectionState = useMemo(() => ({
    hasSelection: selectedObjects.length > 0,
    selectedObject: selectedObjects[0] || null,
    selectedObjectName: selectedObjects[0]?.name || ''
  }), [selectedObjects]);

  // Use material properties from selected object or fallback to box properties
  const displayColor = selectionState.hasSelection ? materialProps.color : boxColor;
  const setDisplayColor = selectionState.hasSelection 
    ? useCallback((color: string) => updateMaterialProperty('color', color), [updateMaterialProperty])
    : setBoxColor;

  // Memoized material property handlers
  const handleMetalnessChange = useCallback(([value]: number[]) => {
    updateMaterialProperty('metalness', value / 100);
  }, [updateMaterialProperty]);

  const handleRoughnessChange = useCallback(([value]: number[]) => {
    updateMaterialProperty('roughness', value / 100);
  }, [updateMaterialProperty]);

  const handleEnvMapChange = useCallback(([value]: number[]) => {
    updateMaterialProperty('envMapIntensity', value / 100);
  }, [updateMaterialProperty]);

  const handleOpacityChange = useCallback(([value]: number[]) => {
    updateMaterialProperty('opacity', value / 100);
  }, [updateMaterialProperty]);

  const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayColor(e.target.value);
  }, [setDisplayColor]);

  const handleColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayColor(e.target.value);
  }, [setDisplayColor]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectionState.selectedObject) {
      const newName = e.target.value;
      selectionState.selectedObject.name = newName;
      if (selectionState.selectedObject.object) {
        selectionState.selectedObject.object.name = newName;
      }
    }
  }, [selectionState.selectedObject]);

  // Safe fallbacks for material properties
  const metalness = materialProps?.metalness ?? 0.1;
  const roughness = materialProps?.roughness ?? 0.6;
  const envMapIntensity = materialProps?.envMapIntensity ?? 0.5;
  const opacity = materialProps?.opacity ?? 1.0;

  return (
    <TooltipProvider>
      <div className="space-y-3 p-2">
        {/* Compact Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <Box className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Properties</span>
        </div>

        {selectionState.hasSelection ? (
          <>
            {/* Object name - Only show when object is selected */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-slate-400" />
                <Label className="text-xs text-slate-600 dark:text-slate-400">Name</Label>
              </div>
              <Input
                value={selectionState.selectedObjectName}
                onChange={handleNameChange}
                className="h-7 text-xs"
                placeholder="Object name"
              />
            </div>

            <Separator className="bg-slate-600/30" />

            {/* Material Properties Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Palette className="h-3 w-3 text-blue-400" />
                <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Material</Label>
              </div>
              
              {/* Color */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-500 dark:text-slate-500">Diffuse Color</Label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={displayColor}
                    onChange={handleColorPickerChange}
                    className="w-7 h-7 rounded border border-slate-600/50 bg-transparent cursor-pointer"
                  />
                  <Input
                    value={displayColor}
                    onChange={handleColorInputChange}
                    className="h-7 text-xs flex-1"
                    placeholder="#808080"
                  />
                </div>
              </div>

              {/* Opacity */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Droplets className="h-2.5 w-2.5 text-blue-400" />
                  <Label className="text-xs text-slate-500 dark:text-slate-500">Opacity</Label>
                  <span className="text-xs text-slate-400 ml-auto">{opacity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[opacity * 100]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleOpacityChange}
                />
              </div>

              {/* Metalness */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-yellow-400" />
                  <Label className="text-xs text-slate-500 dark:text-slate-500">Metalness</Label>
                  <span className="text-xs text-slate-400 ml-auto">{metalness.toFixed(2)}</span>
                </div>
                <Slider
                  value={[metalness * 100]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleMetalnessChange}
                />
              </div>

              {/* Roughness */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Eye className="h-2.5 w-2.5 text-green-400" />
                  <Label className="text-xs text-slate-500 dark:text-slate-500">Roughness</Label>
                  <span className="text-xs text-slate-400 ml-auto">{roughness.toFixed(2)}</span>
                </div>
                <Slider
                  value={[roughness * 100]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleRoughnessChange}
                />
              </div>

              {/* Environment Intensity */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Globe className="h-2.5 w-2.5 text-cyan-400" />
                  <Label className="text-xs text-slate-500 dark:text-slate-500">Reflection</Label>
                  <span className="text-xs text-slate-400 ml-auto">{envMapIntensity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[envMapIntensity * 100]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleEnvMapChange}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-slate-400" />
              <Label className="text-xs text-slate-500 dark:text-slate-500">No object selected</Label>
            </div>
            <p className="text-xs text-slate-400">Select an object to edit its properties</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});

PropertiesTab.displayName = 'PropertiesTab';

export default PropertiesTab;
