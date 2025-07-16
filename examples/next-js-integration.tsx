// Example for Next.js integration
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ModelViewer3D to avoid SSR issues
const ModelViewer3D = dynamic(
  () => import('@yourcompany/model-viewer-3d').then(mod => mod.ModelViewer3D),
  { 
    ssr: false,
    loading: () => <div>Loading 3D Viewer...</div>
  }
);

/**
 * Next.js integration example
 */
function NextJSIntegration() {
  const [isClient, setIsClient] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setModelFile(file);
    }
  };

  const handleModelLoad = (model: any) => {
    console.log('Model loaded in Next.js app:', model);
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3D Model Viewer in Next.js</h1>
      
      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept=".glb,.gltf,.fbx"
          onChange={handleFileUpload}
          className="mb-2"
        />
      </div>
      
      {/* 3D Viewer */}
      <div className="w-full h-96 border rounded-lg overflow-hidden">
        <ModelViewer3D
          width="100%"
          height="100%"
          theme="dark"
          initialModel={modelFile || undefined}
          onModelLoad={handleModelLoad}
          lightingConfig={{
            sunlight: { intensity: 1.2 },
            ambientLight: { intensity: 0.4 }
          }}
          toolsConfig={{
            enableMeasurement: true,
            showGrid: true
          }}
        />
      </div>
    </div>
  );
}

export default NextJSIntegration;