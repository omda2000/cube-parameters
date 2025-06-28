
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
  onCameraToggle?: (orthographic: boolean) => void;
}

const ViewTab = ({ 
  environment, 
  setEnvironment, 
  isOrthographic = false,
  onCameraToggle
}: ViewTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">View Settings</span>
        </div>

        {/* Camera Type Toggle */}
        {onCameraToggle && (
          <>
            <CameraTypeToggle
              isOrthographic={isOrthographic}
              onToggle={onCameraToggle}
            />
            <Separator className="bg-gray-200" />
          </>
        )}

        {/* Grid controls */}
        <div className="space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm text-gray-700">Grid</Label>
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

        <Separator className="bg-gray-200" />

        {/* Background controls */}
        <div className="space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm text-gray-700">Background</Label>
                </div>
                <Select 
                  value={environment.background} 
                  onValueChange={(value) => setEnvironment({ ...environment, background: value as any })}
                >
                  <SelectTrigger className="h-8 text-sm">
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

        <Separator className="bg-gray-200" />

        {/* Camera controls */}
        <div className="space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm text-gray-700">Field of View</Label>
                </div>
                <Slider
                  value={[environment.cameraFov || 75]}
                  onValueChange={([value]) => setEnvironment({ ...environment, cameraFov: value })}
                  min={30}
                  max={120}
                  step={5}
                  className="h-6"
                />
                <div className="text-xs text-gray-500 mt-1">{environment.cameraFov || 75}°</div>
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
