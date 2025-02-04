import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  const handleChange = (value: string, dimension: 'length' | 'width' | 'height') => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setDimensions(prev => ({
        ...prev,
        [dimension]: Math.min(Math.max(numValue, 0.1), 3)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Box Dimensions</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            type="number"
            value={dimensions.length}
            onChange={(e) => handleChange(e.target.value, 'length')}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={dimensions.width}
            onChange={(e) => handleChange(e.target.value, 'width')}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={dimensions.height}
            onChange={(e) => handleChange(e.target.value, 'height')}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="shadows" />
          <Label htmlFor="shadows">Enable Shadows</Label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          Use the controls to adjust dimensions and view settings.
        </p>
      </div>
    </div>
  );
};

export default BoxControls;