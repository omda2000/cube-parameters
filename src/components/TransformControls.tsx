
import { Button } from "@/components/ui/button";
import { Move, RotateCw, Box } from "lucide-react";

interface TransformControlsProps {
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
}

const TransformControls = ({ transformMode, setTransformMode }: TransformControlsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Move className="h-5 w-5 text-green-400" />
        Transform Mode
      </h2>
      
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={transformMode === 'translate' ? 'default' : 'outline'}
          className={`${transformMode === 'translate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
          onClick={() => setTransformMode('translate')}
        >
          <Move className="h-4 w-4 mr-2" />
          Move
        </Button>
        <Button
          variant={transformMode === 'rotate' ? 'default' : 'outline'}
          className={`${transformMode === 'rotate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
          onClick={() => setTransformMode('rotate')}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Rotate
        </Button>
        <Button
          variant={transformMode === 'scale' ? 'default' : 'outline'}
          className={`${transformMode === 'scale' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-300 border-slate-600 hover:bg-slate-700/50'}`}
          onClick={() => setTransformMode('scale')}
        >
          <Box className="h-4 w-4 mr-2" />
          Scale
        </Button>
      </div>
      
      <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-800/50">
        <p className="text-xs text-indigo-200">
          Click on the object to select it, then use the transform controls to manipulate it. Use mouse to orbit the camera.
        </p>
      </div>
    </div>
  );
};

export default TransformControls;
