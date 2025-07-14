import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useUnits } from '@/contexts/UnitsContext';
import { Settings, Palette, Ruler } from 'lucide-react';

const SettingsPanel = () => {
  const { theme, setTheme } = useTheme();
  const { unit, setUnit } = useUnits();

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Appearance</Label>
            </div>
            
            <div className="flex items-center justify-between pl-6">
              <Label className="text-sm text-muted-foreground">Dark Theme</Label>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>

          <Separator />

          {/* Units Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Units</Label>
            </div>
            
            <div className="space-y-2 pl-6">
              <Label className="text-sm text-muted-foreground">Measurement Units</Label>
              <Select value={unit} onValueChange={(value) => setUnit(value as any)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">Meters (m)</SelectItem>
                  <SelectItem value="feet">Feet (ft)</SelectItem>
                  <SelectItem value="inches">Inches (in)</SelectItem>
                  <SelectItem value="centimeters">Centimeters (cm)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Default underlying units: meters. Display will convert automatically.
              </p>
            </div>
          </div>

          <Separator />

          {/* Additional Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Additional Settings</Label>
            <div className="text-xs text-muted-foreground pl-6">
              More settings will be available in future updates
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;