
import React from 'react';
import * as THREE from 'three';

interface ObjectData {
  name: string;
  type: string;
  vertices?: number;
  triangles?: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
}

interface ObjectDataOverlayProps {
  objectData: ObjectData | null;
  mousePosition: { x: number; y: number };
  visible: boolean;
}

const ObjectDataOverlay = ({ objectData, mousePosition, visible }: ObjectDataOverlayProps) => {
  if (!visible || !objectData) return null;

  return (
    <div 
      className="fixed bg-slate-900/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 text-sm text-white z-50 pointer-events-none"
      style={{ 
        left: mousePosition.x + 15, 
        top: mousePosition.y - 10,
        maxWidth: '250px'
      }}
    >
      <div className="space-y-2">
        <div className="font-semibold text-cyan-400">{objectData.name}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400">Type:</span>
            <div className="text-white">{objectData.type}</div>
          </div>
          {objectData.vertices && (
            <div>
              <span className="text-slate-400">Vertices:</span>
              <div className="text-white">{objectData.vertices.toLocaleString()}</div>
            </div>
          )}
          {objectData.triangles && (
            <div>
              <span className="text-slate-400">Triangles:</span>
              <div className="text-white">{objectData.triangles.toLocaleString()}</div>
            </div>
          )}
          <div>
            <span className="text-slate-400">Visible:</span>
            <div className="text-white">{objectData.visible ? 'Yes' : 'No'}</div>
          </div>
        </div>
        <div className="text-xs">
          <div className="text-slate-400">Position:</div>
          <div className="text-white font-mono">
            X: {objectData.position.x.toFixed(2)}<br/>
            Y: {objectData.position.y.toFixed(2)}<br/>
            Z: {objectData.position.z.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDataOverlay;
