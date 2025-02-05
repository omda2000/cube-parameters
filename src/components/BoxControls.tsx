import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  setObjectName
}: BoxControlsProps) => {
  const handleChange = (value: number, dimension: 'length' | 'width' | 'height') => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Box Properties</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Object Name</label>
          <Input
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
            placeholder="Enter object name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Box Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Length</label>
            <span className="text-sm text-gray-400">{dimensions.length.toFixed(1)}</span>
          </div>
          <Slider
            value={[dimensions.length]}
            onValueChange={([value]) => handleChange(value, 'length')}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Width</label>
            <span className="text-sm text-gray-400">{dimensions.width.toFixed(1)}</span>
          </div>
          <Slider
            value={[dimensions.width]}
            onValueChange={([value]) => handleChange(value, 'width')}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Height</label>
            <span className="text-sm text-gray-400">{dimensions.height.toFixed(1)}</span>
          </div>
          <Slider
            value={[dimensions.height]}
            onValueChange={([value]) => handleChange(value, 'height')}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          variant={showShadow ? "default" : "outline"}
          className="w-full"
          onClick={() => setShowShadow(!showShadow)}
        >
          {showShadow ? "Hide Shadow" : "Show Shadow"}
        </Button>

        <Button 
          variant={showEdges ? "default" : "outline"}
          className="w-full"
          onClick={() => setShowEdges(!showEdges)}
        >
          {showEdges ? "Hide Edges" : "Show Edges"}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          Drag to rotate the box view. Scroll to zoom in/out.
        </p>
      </div>
    </div>
  );
};

export default BoxControls;