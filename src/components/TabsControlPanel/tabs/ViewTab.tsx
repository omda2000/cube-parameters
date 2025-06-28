
import { Eye, Grid3X3, Camera, Monitor } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import CameraTypeToggle from '../../CameraTypeToggle/CameraTypeToggle';
import { useNotifications } from '@/contexts/NotificationContext';
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
  const { addMessage } = useNotifications();

  const handleBackgroundChange = (value: string) => {
    const newEnvironment = { ...environment, background: value as any };
    setEnvironment(newEnvironment);
    
    // Update the actual 3D scene background
    const updateSceneBackground = (window as any).__updateSceneBackground;
    if (updateSceneBackground) {
      updateSceneBackground(value);
    }
    
    addMessage({
      type: 'info',
      title: 'Background Changed',
      description: `Background set to ${value}`,
    });
  };

  const handleGridToggle = (checked: boolean) => {
    const newEnvironment = { ...environment, showGrid: checked };
    setEnvironment(newEnvironment);
    
    // Update the actual 3D scene grid
    const updateSceneGrid = (window as any).__updateSceneGrid;
    if (updateSceneGrid) {
      updateSceneGrid(checked);
    }
    
    addMessage({
      type: 'info',
      title: 'Grid Toggle',
      description: `Grid ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleFovChange = (value: number[]) => {
    const newEnvironment = { ...environment, cameraFov: value[0] };
    setEnvironment(newEnvironment);
    
    // Update the actual 3D camera FOV
    const updateCameraFov = (window as any).__updateCameraFov;
    if (updateCameraFov) {
      updateCameraFov(value[0]);
    }
    
    addMessage({
      type: 'info',
      title: 'FOV Changed',
      description: `Field of view set to ${value[0]}°`,
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Eye className="h-4 w-4 text-slate-600" />
          <span className="text-xs font-medium text-slate-900">View</span>
        </div>

        {/* Camera Type Toggle */}
        {onCameraToggle && (
          <>
            <CameraTypeToggle
              isOrthographic={isOrthographic}
              onToggle={onCameraToggle}
            />
            <Separator className="bg-slate-200" />
          </>
        )}

        {/* Grid controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Grid3X3 className="h-3 w-3 text-slate-600" />
                    <Label className="text-xs text-slate-900">Grid</Label>
                  </div>
                  <Switch
                    checked={environment.showGrid}
                    onCheckedChange={handleGridToggle}
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid Visibility</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-200" />

        {/* Background controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Monitor className="h-3 w-3 text-slate-600" />
                  <Label className="text-xs text-slate-900">Background</Label>
                </div>
                <Select 
                  value={environment.background} 
                  onValueChange={handleBackgroundChange}
                >
                  <SelectTrigger className="h-6 text-xs bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 z-60">
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

        <Separator className="bg-slate-200" />

        {/* Camera controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Camera className="h-3 w-3 text-slate-600" />
                  <Label className="text-xs text-slate-900">FOV</Label>
                </div>
                <Slider
                  value={[environment.cameraFov || 75]}
                  onValueChange={handleFovChange}
                  min={30}
                  max={120}
                  step={5}
                  className="h-4"
                />
                <div className="text-xs text-slate-600 mt-1">{environment.cameraFov || 75}°</div>
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
