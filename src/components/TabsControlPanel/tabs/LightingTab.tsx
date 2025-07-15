
import { Sun, Lightbulb, Globe, Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings 
} from '../../../types/model';

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
    <div className="space-y-4 p-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            Sunlight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Intensity</Label>
            <div className="flex items-center gap-3 mt-2">
              <Slider
                value={[sunlight.intensity]}
                onValueChange={([value]) => setSunlight({ ...sunlight, intensity: value })}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <Badge variant="outline" className="min-w-[3rem] text-xs">
                {sunlight.intensity.toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            Ambient Light
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Intensity</Label>
            <div className="flex items-center gap-3 mt-2">
              <Slider
                value={[ambientLight.intensity]}
                onValueChange={([value]) => setAmbientLight({ ...ambientLight, intensity: value })}
                max={2}
                step={0.1}
                className="flex-1"
              />
              <Badge variant="outline" className="min-w-[3rem] text-xs">
                {ambientLight.intensity.toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            Shadows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={shadowQuality} onValueChange={setShadowQuality}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Quality</SelectItem>
              <SelectItem value="medium">Medium Quality</SelectItem>
              <SelectItem value="high">High Quality</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-green-500" />
            Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={environment.preset} onValueChange={(value) => setEnvironment({ ...environment, preset: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunset">🌅 Sunset</SelectItem>
              <SelectItem value="dawn">🌄 Dawn</SelectItem>
              <SelectItem value="night">🌃 Night</SelectItem>
              <SelectItem value="forest">🌲 Forest</SelectItem>
              <SelectItem value="apartment">🏠 Apartment</SelectItem>
              <SelectItem value="studio">🎬 Studio</SelectItem>
              <SelectItem value="city">🏙️ City</SelectItem>
              <SelectItem value="park">🌳 Park</SelectItem>
              <SelectItem value="lobby">🏢 Lobby</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default LightingTab;
