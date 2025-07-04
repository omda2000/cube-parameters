
import React from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PanelSettings {
  gridSize: number;
  snapToGrid: boolean;
  showAxes: boolean;
  renderQuality: 'low' | 'medium' | 'high';
  shadowQuality: 'low' | 'medium' | 'high';
}

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  settings: PanelSettings;
  onSettingsChange: (settings: PanelSettings) => void;
}

const SettingsPanel = ({ visible, onClose, settings, onSettingsChange }: SettingsPanelProps) => {
  if (!visible) return null;

  const handleSettingChange = (key: keyof PanelSettings, value: PanelSettings[keyof PanelSettings]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed top-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 z-40 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-slate-400 hover:text-white"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Grid Size</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={settings.gridSize}
            onChange={(e) => handleSettingChange('gridSize', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Snap to Grid</Label>
          <Switch
            checked={settings.snapToGrid}
            onCheckedChange={(checked) => handleSettingChange('snapToGrid', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Axes</Label>
          <Switch
            checked={settings.showAxes}
            onCheckedChange={(checked) => handleSettingChange('showAxes', checked)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Render Quality</Label>
          <Select value={settings.renderQuality} onValueChange={(value) => handleSettingChange('renderQuality', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shadow Quality</Label>
          <Select value={settings.shadowQuality} onValueChange={(value) => handleSettingChange('shadowQuality', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
