
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Lightbulb, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SunlightSettings {
  intensity: number;
  azimuth: number;
  elevation: number;
  color: string;
  castShadow: boolean;
}

interface AmbientLightSettings {
  intensity: number;
  color: string;
}

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
  showGround: boolean;
}

interface LightingControlsProps {
  sunlight: SunlightSettings;
  setSunlight: (settings: SunlightSettings) => void;
  ambientLight: AmbientLightSettings;
  setAmbientLight: (settings: AmbientLightSettings) => void;
  shadowQuality: 'low' | 'medium' | 'high';
  setShadowQuality: (quality: 'low' | 'medium' | 'high') => void;
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
}

const LightingControls = ({ 
  sunlight, 
  setSunlight, 
  ambientLight, 
  setAmbientLight,
  shadowQuality,
  setShadowQuality,
  environment,
  setEnvironment
}: LightingControlsProps) => {
  const { toast } = useToast();

  const setTimeOfDay = (preset: string) => {
    const presets = {
      dawn: { 
        azimuth: 90, 
        elevation: 10, 
        intensity: 0.6, 
        color: '#FFE4B5',
        skyColor: '#FFB347',
        ambientColor: '#FFF8DC',
        ambientIntensity: 0.4
      },
      noon: { 
        azimuth: 180, 
        elevation: 90, 
        intensity: 1.2, 
        color: '#FFFFFF',
        skyColor: '#87CEEB',
        ambientColor: '#F0F8FF',
        ambientIntensity: 0.5
      },
      sunset: { 
        azimuth: 270, 
        elevation: 15, 
        intensity: 0.8, 
        color: '#FF6347',
        skyColor: '#FF4500',
        ambientColor: '#FFE4B5',
        ambientIntensity: 0.3
      },
      night: { 
        azimuth: 0, 
        elevation: -10, 
        intensity: 0.1, 
        color: '#4169E1',
        skyColor: '#191970',
        ambientColor: '#483D8B',
        ambientIntensity: 0.2
      }
    };
    
    const settings = presets[preset as keyof typeof presets];
    if (settings) {
      setSunlight({ 
        ...sunlight, 
        azimuth: settings.azimuth,
        elevation: settings.elevation,
        intensity: settings.intensity,
        color: settings.color
      });
      
      setAmbientLight({
        ...ambientLight,
        color: settings.ambientColor,
        intensity: settings.ambientIntensity
      });
      
      setEnvironment({
        ...environment,
        skyColor: settings.skyColor
      });
      
      toast({
        title: "Lighting preset applied",
        description: `Changed to ${preset} lighting with matching sky`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Sun className="h-5 w-5 text-yellow-400" />
        Lighting Controls
      </h2>
      
      {/* Time of Day Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Time of Day Presets</label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('dawn')}>
            🌅 Dawn
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('noon')}>
            ☀️ Noon
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('sunset')}>
            🌇 Sunset
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('night')}>
            🌙 Night
          </Button>
        </div>
      </div>

      {/* Sun Light Controls */}
      <div className="space-y-4 border-t border-slate-700/50 pt-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-400" />
          Sun Light
        </h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Intensity</label>
              <span className="text-sm text-indigo-300">{sunlight.intensity.toFixed(1)}</span>
            </div>
            <Slider
              value={[sunlight.intensity]}
              onValueChange={([value]) => setSunlight({ ...sunlight, intensity: value })}
              min={0}
              max={2}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Azimuth</label>
              <span className="text-sm text-indigo-300">{sunlight.azimuth}°</span>
            </div>
            <Slider
              value={[sunlight.azimuth]}
              onValueChange={([value]) => setSunlight({ ...sunlight, azimuth: value })}
              min={0}
              max={360}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Elevation</label>
              <span className="text-sm text-indigo-300">{sunlight.elevation}°</span>
            </div>
            <Slider
              value={[sunlight.elevation]}
              onValueChange={([value]) => setSunlight({ ...sunlight, elevation: value })}
              min={-30}
              max={90}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sun Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={sunlight.color}
                onChange={(e) => setSunlight({ ...sunlight, color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={sunlight.color}
                onChange={(e) => setSunlight({ ...sunlight, color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cast Shadows</label>
            <Switch
              checked={sunlight.castShadow}
              onCheckedChange={(checked) => setSunlight({ ...sunlight, castShadow: checked })}
            />
          </div>
        </div>
      </div>

      {/* Ambient Light Controls */}
      <div className="space-y-4 border-t border-slate-700/50 pt-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-400" />
          Ambient Light
        </h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Intensity</label>
              <span className="text-sm text-indigo-300">{ambientLight.intensity.toFixed(1)}</span>
            </div>
            <Slider
              value={[ambientLight.intensity]}
              onValueChange={([value]) => setAmbientLight({ ...ambientLight, intensity: value })}
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ambient Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={ambientLight.color}
                onChange={(e) => setAmbientLight({ ...ambientLight, color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={ambientLight.color}
                onChange={(e) => setAmbientLight({ ...ambientLight, color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shadow Quality */}
      <div className="space-y-2 border-t border-slate-700/50 pt-4">
        <label className="text-sm font-medium flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-400" />
          Shadow Quality
        </label>
        <Select value={shadowQuality} onValueChange={(value: 'low' | 'medium' | 'high') => setShadowQuality(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (512px)</SelectItem>
            <SelectItem value="medium">Medium (1024px)</SelectItem>
            <SelectItem value="high">High (2048px)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LightingControls;
