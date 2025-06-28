import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useUnits } from '@/contexts/UnitsContext';

const SettingsTab = () => {
  const { theme, setTheme } = useTheme();
  const { unit, setUnit } = useUnits();

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-800 mb-4">UI Settings</h3>
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm text-gray-700">Dark Theme</Label>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => {
              console.log('Theme toggle clicked:', checked);
              setTheme(checked ? 'dark' : 'light');
            }}
          />
        </div>

        {/* Units Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-700">Measurement Units</Label>
          <Select value={unit} onValueChange={(value) => setUnit(value as any)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meters">Meters (m)</SelectItem>
              <SelectItem value="feet">Feet (ft)</SelectItem>
              <SelectItem value="inches">Inches (in)</SelectItem>
              <SelectItem value="centimeters">Centimeters (cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-800 mb-4">Grid Settings</h3>
        
        {/* Grid Size would go here - keeping simple for now */}
        <div className="text-sm text-gray-500">
          Grid settings will be expanded in future updates
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
