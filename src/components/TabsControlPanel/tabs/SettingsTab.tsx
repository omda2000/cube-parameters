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
    <div className="p-3 space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800 mb-3">UI Settings</h3>
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-700">Dark Theme</Label>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>

        {/* Units Selection */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-700">Measurement Units</Label>
          <Select value={unit} onValueChange={(value) => setUnit(value as any)}>
            <SelectTrigger className="h-8 text-xs bg-white border-gray-300">
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

      <div className="border-t border-gray-200 pt-3">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Grid Settings</h3>
        
        {/* Grid Size would go here - keeping simple for now */}
        <div className="text-xs text-gray-600">
          Grid settings will be expanded in future updates
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
