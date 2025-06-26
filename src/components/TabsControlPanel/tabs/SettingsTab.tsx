
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

interface SettingsTabProps {
  settings: {
    units: 'metric' | 'imperial' | 'custom';
    precision: number;
    showGrid: boolean;
    showAxes: boolean;
    snapToGrid: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const SettingsTab = ({ settings, onSettingsChange }: SettingsTabProps) => {
  const handleSettingChange = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
        <Settings className="h-4 w-4" />
        Application Settings
      </div>

      {/* Units */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-300">Units</Label>
        <Select 
          value={settings.units} 
          onValueChange={(value: 'metric' | 'imperial' | 'custom') => handleSettingChange('units', value)}
        >
          <SelectTrigger className="bg-slate-800/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (m, cm, mm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
            <SelectItem value="custom">Custom Units</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Precision */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-300">Measurement Precision</Label>
        <Input
          type="number"
          min="0"
          max="6"
          value={settings.precision}
          onChange={(e) => handleSettingChange('precision', parseInt(e.target.value))}
          className="bg-slate-800/50"
        />
        <p className="text-xs text-slate-400">Number of decimal places</p>
      </div>

      {/* Display Options */}
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <Label className="text-sm font-medium text-slate-300">Display Options</Label>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-300">Show Grid</Label>
          <Switch
            checked={settings.showGrid}
            onCheckedChange={(checked) => handleSettingChange('showGrid', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-300">Show Axes</Label>
          <Switch
            checked={settings.showAxes}
            onCheckedChange={(checked) => handleSettingChange('showAxes', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-300">Snap to Grid</Label>
          <Switch
            checked={settings.snapToGrid}
            onCheckedChange={(checked) => handleSettingChange('snapToGrid', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
