
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Ruler } from 'lucide-react';

const SettingsTab = () => {
  const [units, setUnits] = useState('metric');
  const [precision, setPrecision] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Settings className="h-4 w-4" />
        Application Settings
      </div>

      {/* Units Section */}
      <div className="space-y-4 border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Ruler className="h-4 w-4" />
          Measurement Units
        </div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium text-slate-300">Unit System</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (m, cm, mm)</SelectItem>
                <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
                <SelectItem value="custom">Custom Units</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-300">Decimal Precision</Label>
            <Input
              type="number"
              min="0"
              max="6"
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value) || 2)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="space-y-4 border-t border-slate-700/50 pt-4">
        <div className="text-sm font-medium text-slate-300">Display Settings</div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-300">Show Grid</Label>
            <Switch
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-300">Show Axes</Label>
            <Switch
              checked={showAxes}
              onCheckedChange={setShowAxes}
            />
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="space-y-4 border-t border-slate-700/50 pt-4">
        <div className="text-sm font-medium text-slate-300">Performance</div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium text-slate-300">Render Quality</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Better Performance)</SelectItem>
                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                <SelectItem value="high">High (Better Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
