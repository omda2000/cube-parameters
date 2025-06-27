
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';

export const useToolHandlers = (
  setActiveTool: (tool: 'select' | 'point' | 'measure' | 'move') => void,
  setShowMeasurePanel: (show: boolean) => void,
  addMeasurement: (start: THREE.Vector3, end: THREE.Vector3) => any
) => {
  const { toast } = useToast();

  const handleToolSelect = (tool: 'select' | 'point' | 'measure' | 'move') => {
    setActiveTool(tool);
    if (tool === 'measure') {
      setShowMeasurePanel(true);
    }
  };

  const handlePointCreate = (point: { x: number; y: number; z: number }) => {
    console.log('Point created:', point);
    toast({
      title: "Point added",
      description: `Position: (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`,
    });
  };

  const handleMeasureCreate = (start: THREE.Vector3, end: THREE.Vector3) => {
    const measurement = addMeasurement(start, end);
    toast({
      title: "Measurement added",
      description: `Distance: ${measurement.distance.toFixed(3)} units`,
    });
  };

  return {
    handleToolSelect,
    handlePointCreate,
    handleMeasureCreate
  };
};
