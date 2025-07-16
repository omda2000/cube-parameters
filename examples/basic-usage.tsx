import React from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';
import '@yourcompany/model-viewer-3d/dist/style.css';

/**
 * Basic usage example of ModelViewer3D component
 */
function BasicUsageExample() {
  const handleModelLoad = (model: any) => {
    console.log('Model loaded successfully:', model.name);
  };

  const handleError = (error: Error) => {
    console.error('Failed to load model:', error);
  };

  return (
    <div style={{ width: '100%', height: '600px', padding: '20px' }}>
      <h2>Basic 3D Model Viewer</h2>
      
      <ModelViewer3D 
        width="100%"
        height="500px"
        theme="dark"
        onModelLoad={handleModelLoad}
        onModelError={handleError}
        showToolbar={true}
        showControlPanel={true}
      />
    </div>
  );
}

export default BasicUsageExample;