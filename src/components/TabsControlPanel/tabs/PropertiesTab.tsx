
import { Box, Palette, Tag, Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useSelectionContext } from '../../../contexts/SelectionContext';
import * as THREE from 'three';
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
  const { selectedObject } = useSelectionContext();

  const updateMaterialColor = (material: THREE.Material, color: THREE.Color) => {
    try {
      if (material && typeof material === 'object') {
        if ('color' in material && material.color && typeof material.color.copy === 'function') {
          material.color.copy(color);
          material.needsUpdate = true;
        }
      }
    } catch (error) {
      console.error('Error updating material color:', error);
    }
  };

  const handleColorChange = (newColor: string) => {
    setBoxColor(newColor);
    
    if (!selectedObject?.object) {
      return;
    }

    try {
      const color = new THREE.Color(newColor);
      
      // Handle the selected object
      if (selectedObject.object instanceof THREE.Mesh) {
        const mesh = selectedObject.object as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => updateMaterialColor(mat, color));
          } else {
            updateMaterialColor(mesh.material, color);
          }
        }
      }
      
      // Handle all child meshes
      selectedObject.object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => updateMaterialColor(mat, color));
          } else {
            updateMaterialColor(child.material, color);
          }
        }
      });
    } catch (error) {
      console.error('Error in handleColorChange:', error);
    }
  };

  const handleNameChange = (newName: string) => {
    setObjectName(newName);
    if (selectedObject?.object) {
      selectedObject.object.name = newName;
    }
  };

  const handleDimensionChange = (key: keyof BoxDimensions, value: number) => {
    const newDimensions = { ...dimensions, [key]: value };
    setDimensions(newDimensions);
    
    // Update geometry if it's a box
    if (selectedObject?.object instanceof THREE.Mesh) {
      const mesh = selectedObject.object as THREE.Mesh;
      if (mesh.geometry instanceof THREE.BoxGeometry) {
        try {
          const newGeometry = new THREE.BoxGeometry(
            newDimensions.length,
            newDimensions.width,
            newDimensions.height
          );
          mesh.geometry.dispose();
          mesh.geometry = newGeometry;
        } catch (error) {
          console.error('Error updating geometry:', error);
        }
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Box className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Properties & Materials</span>
        </div>

        {selectedObject ? (
          <>
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
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="h-6 text-xs"
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

            {/* Color picker */}
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
                        value={boxColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-8 h-6 rounded border border-slate-600 bg-transparent"
                      />
                      <Input
                        value={boxColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-6 text-xs flex-1"
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

            <Separator className="bg-slate-600" />

            {/* Dimensions */}
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
                        value={dimensions.length}
                        onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 1)}
                        className="h-6 text-xs"
                        placeholder="L"
                        step="0.1"
                        min="0.1"
                      />
                      <Input
                        type="number"
                        value={dimensions.width}
                        onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 1)}
                        className="h-6 text-xs"
                        placeholder="W"
                        step="0.1"
                        min="0.1"
                      />
                      <Input
                        type="number"
                        value={dimensions.height}
                        onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 1)}
                        className="h-6 text-xs"
                        placeholder="H"
                        step="0.1"
                        min="0.1"
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
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Box className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No object selected</p>
            <p className="text-xs">Select an object to view its properties</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
