
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Eye, Grid3X3, Mountain, TreePine } from "lucide-react";
import ZoomControls from "./ZoomControls";
import type { EnvironmentSettings } from "@/types/model";

interface ViewControlsProps {
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
  onZoomAll?: () => void;
  onZoomToSelected?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
}

const ViewControls = ({ 
  environment, 
  setEnvironment,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView
}: ViewControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Zoom Controls Section */}
      {onZoomAll && onZoomToSelected && onZoomIn && onZoomOut && onResetView && (
        <ZoomControls
          onZoomAll={onZoomAll}
          onZoomToSelected={onZoomToSelected}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onResetView={onResetView}
        />
      )}
      
      {/* Environment Controls Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Eye className="h-4 w-4 text-purple-400" />
          Environment
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Grid3X3 className="h-3 w-3 text-gray-400" />
              Show Grid
            </label>
            <Switch
              checked={environment.showGrid}
              onCheckedChange={(checked) => setEnvironment({ ...environment, showGrid: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <TreePine className="h-3 w-3 text-green-400" />
              Show Ground
            </label>
            <Switch
              checked={environment.showGround}
              onCheckedChange={(checked) => setEnvironment({ ...environment, showGround: checked })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mountain className="h-3 w-3 text-green-400" />
              Ground Color
            </label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={environment.groundColor}
                onChange={(e) => setEnvironment({ ...environment, groundColor: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={environment.groundColor}
                onChange={(e) => setEnvironment({ ...environment, groundColor: e.target.value })}
                className="flex-1 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sky Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={environment.skyColor}
                onChange={(e) => setEnvironment({ ...environment, skyColor: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={environment.skyColor}
                onChange={(e) => setEnvironment({ ...environment, skyColor: e.target.value })}
                className="flex-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewControls;
