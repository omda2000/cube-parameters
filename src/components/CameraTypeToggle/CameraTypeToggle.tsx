
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Camera } from 'lucide-react';

interface CameraTypeToggleProps {
  isOrthographic: boolean;
  onToggle: (orthographic: boolean) => void;
}

const CameraTypeToggle = ({ isOrthographic, onToggle }: CameraTypeToggleProps) => {
  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    // Call the global camera switch function
    const switchCamera = (window as any).__switchCameraMode;
    if (switchCamera) {
      switchCamera(checked);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Camera className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                <Label className="text-xs text-slate-200">Orthographic</Label>
              </div>
              <Switch
                checked={isOrthographic}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Camera Type (O)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CameraTypeToggle;
