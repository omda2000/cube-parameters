import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Eye, EyeOff, Palette, Move, Info, RotateCw } from "lucide-react";

interface BoxControlsProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  setDimensions: React.Dispatch<
    React.SetStateAction<{
      length: number;
      width: number;
      height: number;
    }>
  >;
  showShadow: boolean;
  setShowShadow: (show: boolean) => void;
  showEdges: boolean;
  setShowEdges: (show: boolean) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
}

const BoxControls = ({ 
  dimensions, 
  setDimensions, 
  showShadow, 
  setShowShadow,
  showEdges,
  setShowEdges,
  boxColor,
  setBoxColor,
  objectName,
  setObjectName,
  transformMode,
  setTransformMode
}: BoxControlsProps) => {
  const handleChange = (value: number, dimension: 'length' | 'width' | 'height') => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Box className="h-6 w-6 text-indigo-400" />
        <span>Box Properties</span>
      </h2>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-400" />
            Object Name
          </label>
          <Input
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
            placeholder="Enter object name"
            className="w-full bg-slate-700/50 border-slate-600 focus-visible:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4 text-indigo-400" />
            Box Color
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
              className="flex-1 bg-slate-700/50 border-slate-600 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 pb-1 border-t border-slate-700/70">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Move className="h-5 w-5 text-indigo-400" />
            Transform Mode
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={transformMode === 'translate' ? 'default' : 'outline'}
              className={`${transformMode === 'translate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
              onClick={() => setTransformMode('translate')}
            >
              <Move className="h-4 w-4 mr-1" />
              Move
            </Button>
            <Button
              variant={transformMode === 'rotate' ? 'default' : 'outline'}
              className={`${transformMode === 'rotate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
              onClick={() => setTransformMode('rotate')}
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
            <Button
              variant={transformMode === 'scale' ? 'default' : 'outline'}
              className={`${transformMode === 'scale' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
              onClick={() => setTransformMode('scale')}
            >
              <Box className="h-4 w-4 mr-1" />
              Scale
            </Button>
          </div>
        </div>

        <div className="pt-2 pb-1 border-t border-slate-700/70">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Move className="h-5 w-5 text-indigo-400" />
            Dimensions
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Length</label>
            <span className="text-sm text-indigo-300 font-mono">{dimensions.length.toFixed(1)}</span>
          </div>
          <Slider
            value={[dimensions.length]}
            onValueChange={([value]) => handleChange(value, 'length')}
            min={0.1}
            max={3}
            step={0.1}
            className="py-1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Width</label>
            <span className="text-sm text-indigo-300 font-mono">{dimensions.width.toFixed(1)}</span>
          </div>
          <Slider
            value={[dimensions.width]}
            onValueChange={([value]) => handleChange(value, 'width')}
            min={0.1}
            max={3}
            step={0.1}
            className="py-1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Height</label>
            <span className="text-sm text-indigo-300 font-mono">{dimensions.height.toFixed(1)}</span>
          </div>
          <Slider
            value={[dimensions.height]}
            onValueChange={([value]) => handleChange(value, 'height')}
            min={0.1}
            max={3}
            step={0.1}
            className="py-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/70">
        <Button 
          variant={showShadow ? "default" : "outline"}
          className={`w-full ${showShadow ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
          onClick={() => setShowShadow(!showShadow)}
        >
          {showShadow ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Hide Shadow
            </>
          ) : (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Show Shadow
            </>
          )}
        </Button>

        <Button 
          variant={showEdges ? "default" : "outline"}
          className={`w-full ${showEdges ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
          onClick={() => setShowEdges(!showEdges)}
        >
          {showEdges ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Hide Edges
            </>
          ) : (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Show Edges
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-800/50">
        <p className="text-sm text-indigo-200 flex items-center">
          <Info className="h-4 w-4 mr-2 text-indigo-400" />
          Click on the box to select it, then use transform mode buttons to move, rotate, or scale. Drag to rotate view.
        </p>
      </div>
    </div>
  );
};

export default BoxControls;
