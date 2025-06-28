
import { Settings, Move3D, RotateCw, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../../contexts/SelectionContext';

const PropertiesTab = () => {
  const { selectedObject } = useSelectionContext();

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject) {
      console.log(`Property changed: ${property} = ${value}`);
      
      if (selectedObject.type === 'point' && property.includes('position')) {
        const [prop, axis] = property.split('.');
        if (selectedObject.object.position && axis) {
          selectedObject.object.position[axis as 'x' | 'y' | 'z'] = value;
        }
      }
      
      if (selectedObject.object && property.includes('.')) {
        const [prop, axis] = property.split('.');
        if (prop === 'position' && selectedObject.object.position && axis) {
          selectedObject.object.position[axis as 'x' | 'y' | 'z'] = value;
        } else if (prop === 'rotation' && selectedObject.object.rotation && axis) {
          selectedObject.object.rotation[axis as 'x' | 'y' | 'z'] = value;
        } else if (prop === 'scale' && selectedObject.object.scale && axis) {
          selectedObject.object.scale[axis as 'x' | 'y' | 'z'] = value;
        }
      }
    }
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
      
      handlePropertyChange(`${property}.${axis}`, value);
    }
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
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Settings className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">Properties</span>
        </div>

        {/* Object name - compact */}
        <div className="space-y-1">
          <Input
            value={selectedObject.name}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
            className="h-6 text-xs"
            placeholder="Object name"
          />
        </div>

        <Separator className="bg-slate-600" />

        {/* Transform controls with icons */}
        <div className="space-y-2">
          {/* Position */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Move3D className="h-3 w-3 text-slate-400" />
                  <Label className="text-xs text-slate-300">Position</Label>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedObject.object.position.x.toFixed(2)}
                    onChange={(e) => handleTransformChange('x', 'position', parseFloat(e.target.value))}
                    className="h-6 text-xs"
                    placeholder="X"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedObject.object.position.y.toFixed(2)}
                    onChange={(e) => handleTransformChange('y', 'position', parseFloat(e.target.value))}
                    className="h-6 text-xs"
                    placeholder="Y"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedObject.object.position.z.toFixed(2)}
                    onChange={(e) => handleTransformChange('z', 'position', parseFloat(e.target.value))}
                    className="h-6 text-xs"
                    placeholder="Z"
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Object Position (X, Y, Z)</p>
            </TooltipContent>
          </Tooltip>

          {/* Rotation - hide for point objects */}
          {selectedObject.type !== 'point' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <RotateCw className="h-3 w-3 text-slate-400" />
                    <Label className="text-xs text-slate-300">Rotation</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Input
                      type="number"
                      step="1"
                      value={(selectedObject.object.rotation.x * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => handleTransformChange('x', 'rotation', parseFloat(e.target.value) * Math.PI / 180)}
                      className="h-6 text-xs"
                      placeholder="X°"
                    />
                    <Input
                      type="number"
                      step="1"
                      value={(selectedObject.object.rotation.y * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => handleTransformChange('y', 'rotation', parseFloat(e.target.value) * Math.PI / 180)}
                      className="h-6 text-xs"
                      placeholder="Y°"
                    />
                    <Input
                      type="number"
                      step="1"
                      value={(selectedObject.object.rotation.z * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => handleTransformChange('z', 'rotation', parseFloat(e.target.value) * Math.PI / 180)}
                      className="h-6 text-xs"
                      placeholder="Z°"
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Object Rotation (degrees)</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Scale - hide for point objects */}
          {selectedObject.type !== 'point' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Scale className="h-3 w-3 text-slate-400" />
                    <Label className="text-xs text-slate-300">Scale</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedObject.object.scale.x.toFixed(2)}
                      onChange={(e) => handleTransformChange('x', 'scale', parseFloat(e.target.value))}
                      className="h-6 text-xs"
                      placeholder="X"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedObject.object.scale.y.toFixed(2)}
                      onChange={(e) => handleTransformChange('y', 'scale', parseFloat(e.target.value))}
                      className="h-6 text-xs"
                      placeholder="Y"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedObject.object.scale.z.toFixed(2)}
                      onChange={(e) => handleTransformChange('z', 'scale', parseFloat(e.target.value))}
                      className="h-6 text-xs"
                      placeholder="Z"
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Object Scale (X, Y, Z)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
