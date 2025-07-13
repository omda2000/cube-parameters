
import React from 'react';
import * as THREE from 'three';
import { useUnits } from '@/contexts/UnitsContext';

interface ObjectData {
  name: string;
  id: string;
  type: string;
  position: THREE.Vector3;
}

interface ObjectDataOverlayProps {
  objectData: ObjectData | null;
  mousePosition: { x: number; y: number };
  visible: boolean;
}

const ObjectDataOverlay = ({ objectData, mousePosition, visible }: ObjectDataOverlayProps) => {
  const { formatValue, convertValue } = useUnits();
  
  if (!visible || !objectData) return null;

  return (
    <div 
      className="fixed bg-slate-900/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 text-sm text-white z-50 pointer-events-none"
      style={{ 
        left: mousePosition.x + 15, 
        top: mousePosition.y - 10,
        maxWidth: '200px'
      }}
    >
      <div className="space-y-2">
        <div className="font-semibold text-cyan-400">{objectData.name}</div>
        <div className="text-xs space-y-1">
          <div>
            <span className="text-slate-400">ID:</span>
            <span className="text-white ml-1">{objectData.id}</span>
          </div>
          <div>
            <span className="text-slate-400">Type:</span>
            <span className="text-white ml-1">{objectData.type}</span>
          </div>
          <div>
            <span className="text-slate-400">Position:</span>
            <div className="text-white font-mono ml-1">
              X: {formatValue(convertValue(objectData.position.x))}<br/>
              Y: {formatValue(convertValue(objectData.position.y))}<br/>
              Z: {formatValue(convertValue(objectData.position.z))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDataOverlay;
