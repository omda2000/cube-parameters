import React, { useState } from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';
import '@yourcompany/model-viewer-3d/dist/style.css';

/**
 * Advanced usage example with full configuration
 */
function AdvancedUsageExample() {
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [currentTool, setCurrentTool] = useState<string>('select');

  const handleModelLoad = (model: any) => {
    console.log('Model loaded:', model);
    // You can perform additional operations here
  };

  const handleMeasurement = (measurement: any) => {
    console.log('New measurement:', measurement);
    setMeasurements(prev => [...prev, measurement]);
  };

  const handlePointCreate = (point: { x: number; y: number; z: number }) => {
    console.log('Point created at:', point);
  };

  const handleToolChange = (tool: string) => {
    setCurrentTool(tool);
    console.log('Tool changed to:', tool);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <h2>Advanced 3D Model Viewer</h2>
      
      {/* Status display */}
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Active Tool: {currentTool} | Measurements: {measurements.length}
      </div>
      
      <ModelViewer3D
        width="100%"
        height="600px"
        theme="dark"
        
        // UI Configuration
        showToolbar={true}
        showControlPanel={true}
        showMeasurePanel={true}
        
        // Lighting Configuration
        lightingConfig={{
          sunlight: {
            intensity: 1.5,
            azimuth: 45,
            elevation: 30
          },
          ambientLight: {
            intensity: 0.3
          },
          environment: {
            backgroundType: 'color',
            backgroundColor: '#2a2a2a'
          }
        }}
        
        // Camera Configuration
        cameraConfig={{
          defaultDistance: 12,
          enableOrthographic: true,
          fov: 60
        }}
        
        // Tools Configuration
        toolsConfig={{
          enableMeasurement: true,
          enablePointTool: true,
          enableSelection: true,
          showGrid: true,
          showGroundPlane: false
        }}
        
        // Event Handlers
        onModelLoad={handleModelLoad}
        onMeasurement={handleMeasurement}
        onPointCreate={handlePointCreate}
        onToolChange={handleToolChange}
        onViewChange={(view) => console.log('View changed to:', view)}
        onSceneReady={(scene) => console.log('Scene ready:', scene)}
      />
      
      {/* Measurements Display */}
      {measurements.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Measurements ({measurements.length})</h3>
          {measurements.map((measurement, index) => (
            <div key={index} style={{ fontSize: '12px', margin: '5px 0' }}>
              Measurement {index + 1}: {measurement.distance?.toFixed(2)} units
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdvancedUsageExample;