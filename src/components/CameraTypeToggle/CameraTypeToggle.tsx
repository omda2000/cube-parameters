
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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Camera className="h-3 w-3 text-slate-400" />
                <Label className="text-xs text-slate-300">Orthographic</Label>
              </div>
              <Switch
                checked={isOrthographic}
                onCheckedChange={onToggle}
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
