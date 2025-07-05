
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Box, Palette, Info } from "lucide-react";

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface MaterialControlsProps {
  dimensions: Dimensions;
  setDimensions: React.Dispatch<React.SetStateAction<Dimensions>>;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
}

const MaterialControls = ({ 
  dimensions, 
  setDimensions, 
  boxColor,
  setBoxColor,
  objectName,
  setObjectName
}: MaterialControlsProps) => {
  const handleChange = (value: number, dimension: 'length' | 'width' | 'height') => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Box className="h-5 w-5 text-indigo-400" />
        Object Properties
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-400" />
            Object Name
          </label>
          <Input
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
            placeholder="Enter object name"
            className="bg-slate-700/50 border-slate-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4 text-indigo-400" />
            Material Color
          </label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-16 h-10 p-1 bg-slate-700/50 border-slate-600"
            />
            <Input
              type="text"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              placeholder="#000000"
              className="flex-1 bg-slate-700/50 border-slate-600"
            />
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <h3 className="text-lg font-medium mb-3">Dimensions</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Length</label>
                <span className="text-sm text-indigo-300 font-mono">{dimensions.length.toFixed(1)}m</span>
              </div>
              <Slider
                value={[dimensions.length]}
                onValueChange={([value]) => handleChange(value, 'length')}
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Width</label>
                <span className="text-sm text-indigo-300 font-mono">{dimensions.width.toFixed(1)}m</span>
              </div>
              <Slider
                value={[dimensions.width]}
                onValueChange={([value]) => handleChange(value, 'width')}
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Height</label>
                <span className="text-sm text-indigo-300 font-mono">{dimensions.height.toFixed(1)}m</span>
              </div>
              <Slider
                value={[dimensions.height]}
                onValueChange={([value]) => handleChange(value, 'height')}
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialControls;
