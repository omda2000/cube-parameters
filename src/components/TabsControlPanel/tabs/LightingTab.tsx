
import { Sun, Lightbulb, Globe, Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import type {
  SunlightSettings,
  AmbientLightSettings,
  EnvironmentSettings,
  EnvironmentPreset
} from '@/types/model';

interface LightingTabProps {
  sunlight: SunlightSettings;
  setSunlight: (settings: SunlightSettings) => void;
  ambientLight: AmbientLightSettings;
  setAmbientLight: (settings: AmbientLightSettings) => void;
  shadowQuality: 'low' | 'medium' | 'high';
  setShadowQuality: (quality: 'low' | 'medium' | 'high') => void;
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
}

const LightingTab = ({
  sunlight,
  setSunlight,
  ambientLight,
  setAmbientLight,
  shadowQuality,
  setShadowQuality,
  environment,
  setEnvironment
}: LightingTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Sun className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Lighting</span>
        </div>

        {/* Sunlight controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Sun className="h-3 w-3 text-yellow-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Sun</Label>
                </div>
                <Slider
                  value={[sunlight.intensity]}
                  onValueChange={([value]) => setSunlight({ ...sunlight, intensity: value })}
                  max={3}
                  step={0.1}
                  className="h-4"
                />
                <div className="text-xs text-slate-400 mt-1">{sunlight.intensity.toFixed(1)}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sunlight Intensity</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Ambient light controls */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Lightbulb className="h-3 w-3 text-blue-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Ambient</Label>
                </div>
                <Slider
                  value={[ambientLight.intensity]}
                  onValueChange={([value]) => setAmbientLight({ ...ambientLight, intensity: value })}
                  max={2}
                  step={0.1}
                  className="h-4"
                />
                <div className="text-xs text-slate-400 mt-1">{ambientLight.intensity.toFixed(1)}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ambient Light Intensity</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Shadow quality */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3 text-purple-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Shadows</Label>
                </div>
                <Select value={shadowQuality} onValueChange={setShadowQuality}>
                  <SelectTrigger className="h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Shadow Quality Level</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Environment */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Globe className="h-3 w-3 text-green-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Environment</Label>
                </div>
                <Select
                  value={environment.preset}
                  onValueChange={(value: EnvironmentPreset) =>
                    setEnvironment({ ...environment, preset: value })
                  }
                >
                  <SelectTrigger className="h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="dawn">Dawn</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="park">Park</SelectItem>
                    <SelectItem value="lobby">Lobby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Environment Preset</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LightingTab;
