
import { Box, Palette, Tag, Ruler, Sparkles, Eye, Globe } from 'lucide-react';
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

const PropertiesTab = ({
  dimensions,
  setDimensions,
  boxColor,
  setBoxColor,
  objectName,
  setObjectName
}: PropertiesTabProps) => {
  const { selectedObjects } = useSelectionContext();
  const { materialProps, updateMaterialProperty } = useMaterialProperties(selectedObjects);

  // Use material properties from selected object or fallback to box properties
  const hasSelectedObject = selectedObjects.length > 0;
  const displayColor = hasSelectedObject ? materialProps.color : boxColor;
  const setDisplayColor = hasSelectedObject 
    ? (color: string) => updateMaterialProperty('color', color)
    : setBoxColor;

  // Safe fallbacks for material properties
  const metalness = materialProps?.metalness ?? 0.1;
  const roughness = materialProps?.roughness ?? 0.6;
  const envMapIntensity = materialProps?.envMapIntensity ?? 0.5;

  return (
    <TooltipProvider>
      <div className="space-y-3 p-2">
        {/* Compact Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <Box className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Properties</span>
        </div>

        {/* Object name - Compact */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-slate-400" />
            <Label className="text-xs text-slate-600 dark:text-slate-400">Name</Label>
          </div>
          <Input
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
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
                onChange={(e) => setDisplayColor(e.target.value)}
                className="w-7 h-7 rounded border border-slate-600/50 bg-transparent cursor-pointer"
              />
              <Input
                value={displayColor}
                onChange={(e) => setDisplayColor(e.target.value)}
                className="h-7 text-xs flex-1"
                placeholder="#808080"
              />
            </div>
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
              onValueChange={([value]) => updateMaterialProperty('metalness', value / 100)}
              disabled={!hasSelectedObject}
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
              onValueChange={([value]) => updateMaterialProperty('roughness', value / 100)}
              disabled={!hasSelectedObject}
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
              onValueChange={([value]) => updateMaterialProperty('envMapIntensity', value / 100)}
              disabled={!hasSelectedObject}
            />
          </div>
        </div>

        <Separator className="bg-slate-600/30" />

        {/* Dimensions - Compact */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Ruler className="h-3 w-3 text-cyan-400" />
            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Dimensions</Label>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <Label className="text-xs text-slate-500">L</Label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 1 })}
                className="h-7 text-xs"
                placeholder="L"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">W</Label>
              <Input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 1 })}
                className="h-7 text-xs"
                placeholder="W"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">H</Label>
              <Input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 1 })}
                className="h-7 text-xs"
                placeholder="H"
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
