import { Slider } from "@/components/ui/slider";

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
}

const BoxControls = ({ dimensions, setDimensions }: BoxControlsProps) => {
  const handleChange = (value: number, dimension: 'length' | 'width' | 'height') => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Box Dimensions</h2>
      
      <div className="space-y-4">
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

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          Drag to rotate the box view. Scroll to zoom in/out.
        </p>
      </div>
    </div>
  );
};

export default BoxControls;