
import React from 'react';
import { X, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

interface OrganizedMeasurePanelProps {
  measurements: MeasureData[];
  onClearAll: () => void;
  onRemoveMeasurement: (id: string) => void;
  visible: boolean;
  onClose: () => void;
}

const OrganizedMeasurePanel = ({
  measurements,
  onClearAll,
  onRemoveMeasurement,
  visible,
  onClose
}: OrganizedMeasurePanelProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed left-4 bottom-20 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl z-40 w-80 max-h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-card-foreground">
            Measurements
          </h3>
          <Badge variant="secondary" className="text-xs">
            {measurements.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {measurements.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {measurements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">No measurements created</div>
            <div className="text-xs mt-1">Use the measure tool to add measurements</div>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-2">
              {measurements.map((measurement, index) => (
                <div
                  key={measurement.id}
                  className="p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium">
                        {measurement.label || `Measurement ${index + 1}`}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMeasurement(measurement.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      Distance: <span className="text-foreground font-mono">{measurement.distance.toFixed(3)}m</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="font-medium">Start Point:</div>
                        <div className="font-mono text-xs">
                          X: {measurement.startPoint.x.toFixed(2)}<br />
                          Y: {measurement.startPoint.y.toFixed(2)}<br />
                          Z: {measurement.startPoint.z.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">End Point:</div>
                        <div className="font-mono text-xs">
                          X: {measurement.endPoint.x.toFixed(2)}<br />
                          Y: {measurement.endPoint.y.toFixed(2)}<br />
                          Z: {measurement.endPoint.z.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer with actions */}
      {measurements.length > 0 && (
        <div className="border-t border-border p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              // Export functionality can be added here
              console.log('Export measurements:', measurements);
            }}
          >
            <Download className="h-3 w-3 mr-2" />
            Export Measurements
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizedMeasurePanel;
