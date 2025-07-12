import { Eye, Grid3X3, Camera, Monitor, Layers } from 'lucide-react';
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
    console.log('Background changed to:', value);
    
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
    console.log('Grid toggled:', checked);
    
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

  const handleGroundPlaneToggle = (checked: boolean) => {
    const newEnvironment = { ...environment, showGround: checked };
    setEnvironment(newEnvironment);
    console.log('Ground plane toggled:', checked);
    
    addMessage({
      type: 'info',
      title: 'Ground Plane Toggle',
      description: `Ground plane ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleFovChange = (value: number[]) => {
    const newEnvironment = { ...environment, cameraFov: value[0] };
    setEnvironment(newEnvironment);
    
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

  const handleCameraToggle = (orthographic: boolean) => {
    if (onCameraToggle) {
      onCameraToggle(orthographic);
    }
    
    addMessage({
      type: 'info',
      title: 'Camera Changed',
      description: `Switched to ${orthographic ? 'orthographic' : 'perspective'} view`,
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Eye className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          <span className="text-xs font-medium text-slate-100">View</span>
        </div>

        {/* Camera Type Toggle */}
        <CameraTypeToggle
          isOrthographic={isOrthographic}
          onToggle={handleCameraToggle}
        />
        <Separator className="bg-slate-600" />

        {/* Grid controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Grid3X3 className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                    <Label className="text-xs text-slate-100">Grid</Label>
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

        {/* Ground Plane controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                    <Label className="text-xs text-slate-100">Ground Plane</Label>
                  </div>
                  <Switch
                    checked={environment.showGround}
                    onCheckedChange={handleGroundPlaneToggle}
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Ground Plane Visibility</p>
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
                  <Monitor className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                  <Label className="text-xs text-slate-100">Background</Label>
                </div>
                <Select 
                  value={environment.background} 
                  onValueChange={handleBackgroundChange}
                >
                  <SelectTrigger className="h-6 text-xs bg-slate-700 border-slate-500 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 z-60">
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

        {/* Camera controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Camera className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                  <Label className="text-xs text-slate-100">FOV</Label>
                </div>
                <Slider
                  value={[environment.cameraFov || 75]}
                  onValueChange={handleFovChange}
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
