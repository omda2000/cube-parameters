
import React, { useState } from 'react';
import { Ruler, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

interface MeasureToolsPanelProps {
  measurements: MeasureData[];
  onClearAll: () => void;
  onRemoveMeasurement: (id: string) => void;
  visible: boolean;
  onClose: () => void;
}

const MeasureToolsPanel = ({
  measurements,
  onClearAll,
  onRemoveMeasurement,
  visible,
  onClose
}: MeasureToolsPanelProps) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 z-40 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Measurements
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            title="Clear All"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {measurements.length === 0 ? (
          <div className="text-center py-4 text-slate-400">
            <Ruler className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No measurements</p>
            <p className="text-xs">Use the measure tool to add measurements</p>
          </div>
        ) : (
          measurements.map((measurement) => (
            <div key={measurement.id} className="bg-slate-700/50 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-300">{measurement.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMeasurement(measurement.id)}
                  className="h-4 w-4 p-0 text-slate-400 hover:text-white"
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
              <div className="text-sm text-white font-mono">
                {measurement.distance.toFixed(3)} units
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Start: ({measurement.startPoint.x.toFixed(2)}, {measurement.startPoint.y.toFixed(2)}, {measurement.startPoint.z.toFixed(2)})
              </div>
              <div className="text-xs text-slate-400">
                End: ({measurement.endPoint.x.toFixed(2)}, {measurement.endPoint.y.toFixed(2)}, {measurement.endPoint.z.toFixed(2)})
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeasureToolsPanel;
