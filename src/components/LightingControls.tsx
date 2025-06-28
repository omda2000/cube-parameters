
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Lightbulb, Settings } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

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
  const { addMessage } = useNotifications();

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
      
      addMessage({
        type: 'success',
        title: 'Lighting Preset Applied',
        description: `Changed to ${preset} lighting with matching sky`,
      });
    }
  };

  return (
    <div 
      className="fixed right-16 bg-white/95 backdrop-blur-sm border border-slate-200 rounded shadow-lg z-30 p-4 w-64 max-h-96 overflow-y-auto"
      style={{ top: '480px' }}
    >
      <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 mb-4">
        <Sun className="h-5 w-5 text-yellow-500" />
        Lighting Controls
      </h2>
      
      {/* Time of Day Presets */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-slate-900">Time of Day Presets</label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('dawn')} className="text-xs">
            🌅 Dawn
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('noon')} className="text-xs">
            ☀️ Noon
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('sunset')} className="text-xs">
            🌇 Sunset
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeOfDay('night')} className="text-xs">
            🌙 Night
          </Button>
        </div>
      </div>

      {/* Sun Light Controls */}
      <div className="space-y-3 border-t border-slate-200 pt-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-slate-900">
          <Sun className="h-4 w-4 text-yellow-500" />
          Sun Light
        </h3>
        
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-slate-700">Intensity</label>
              <span className="text-xs text-indigo-600">{sunlight.intensity.toFixed(1)}</span>
            </div>
            <Slider
              value={[sunlight.intensity]}
              onValueChange={([value]) => setSunlight({ ...sunlight, intensity: value })}
              min={0}
              max={2}
              step={0.1}
              className="h-2"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-slate-700">Azimuth</label>
              <span className="text-xs text-indigo-600">{sunlight.azimuth}°</span>
            </div>
            <Slider
              value={[sunlight.azimuth]}
              onValueChange={([value]) => setSunlight({ ...sunlight, azimuth: value })}
              min={0}
              max={360}
              step={1}
              className="h-2"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-slate-700">Elevation</label>
              <span className="text-xs text-indigo-600">{sunlight.elevation}°</span>
            </div>
            <Slider
              value={[sunlight.elevation]}
              onValueChange={([value]) => setSunlight({ ...sunlight, elevation: value })}
              min={-30}
              max={90}
              step={1}
              className="h-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">Cast Shadows</label>
            <Switch
              checked={sunlight.castShadow}
              onCheckedChange={(checked) => setSunlight({ ...sunlight, castShadow: checked })}
            />
          </div>
        </div>
      </div>

      {/* Shadow Quality */}
      <div className="space-y-2 border-t border-slate-200 pt-3 mt-3">
        <label className="text-xs font-medium flex items-center gap-2 text-slate-900">
          <Settings className="h-3 w-3 text-slate-600" />
          Shadow Quality
        </label>
        <Select value={shadowQuality} onValueChange={(value: 'low' | 'medium' | 'high') => setShadowQuality(value)}>
          <SelectTrigger className="h-7 text-xs">
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
