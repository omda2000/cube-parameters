
import { Eye, Grid3X3, Camera, Monitor } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import CameraTypeToggle from '../../CameraTypeToggle/CameraTypeToggle';
import type { EnvironmentSettings } from '../../../types/model';

interface ViewTabProps {
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
  isOrthographic?: boolean;
  onCameraToggle?: (isOrthographic: boolean) => void;
}

const ViewTab = ({ 
  environment, 
  setEnvironment, 
  isOrthographic = false, 
  onCameraToggle 
}: ViewTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Eye className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">View</span>
        </div>

        {/* Camera controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Camera className="h-3 w-3 text-slate-400" />
                    <Label className="text-xs text-slate-300">Camera</Label>
                  </div>
                  {onCameraToggle && (
                    <CameraTypeToggle
                      isOrthographic={isOrthographic}
                      onToggle={onCameraToggle}
                    />
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Camera Type</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Grid controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Grid3X3 className="h-3 w-3 text-slate-400" />
                    <Label className="text-xs text-slate-300">Grid</Label>
                  </div>
                  <Switch
                    checked={environment.showGrid}
                    onCheckedChange={(checked) => setEnvironment({ ...environment, showGrid: checked })}
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid Visibility</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Background controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Monitor className="h-3 w-3 text-slate-400" />
                  <Label className="text-xs text-slate-300">Background</Label>
                </div>
                <Select 
                  value={environment.background} 
                  onValueChange={(value) => setEnvironment({ ...environment, background: value as any })}
                >
                  <SelectTrigger className="h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Background Style</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* FOV controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Camera className="h-3 w-3 text-slate-400" />
                  <Label className="text-xs text-slate-300">FOV</Label>
                </div>
                <Slider
                  value={[environment.cameraFov || 75]}
                  onValueChange={([value]) => setEnvironment({ ...environment, cameraFov: value })}
                  min={30}
                  max={120}
                  step={5}
                  className="h-4"
                />
                <div className="text-xs text-slate-400 mt-1">{environment.cameraFov || 75}°</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Camera Field of View</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ViewTab;
