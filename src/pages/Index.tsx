
import { useState } from 'react';
import BoxViewer from '../components/BoxViewer';
import LightingControls from '../components/LightingControls';
import MaterialControls from '../components/MaterialControls';
import ViewControls from '../components/ViewControls';
import TransformControls from '../components/TransformControls';

const Index = () => {
  const [dimensions, setDimensions] = useState({
    length: 1,
    width: 1,
    height: 1
  });
  const [boxColor, setBoxColor] = useState('#4F46E5');
  const [objectName, setObjectName] = useState('My Box');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  
  // Lighting states
  const [sunlight, setSunlight] = useState({
    intensity: 1,
    azimuth: 45,
    elevation: 45,
    color: '#ffffff',
    castShadow: true
  });
  const [ambientLight, setAmbientLight] = useState({
    intensity: 0.3,
    color: '#ffffff'
  });
  const [shadowQuality, setShadowQuality] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Environment states
  const [environment, setEnvironment] = useState({
    showGrid: true,
    groundColor: '#808080',
    skyColor: '#87CEEB'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex h-screen">
        {/* Main 3D Viewer - Takes remaining space */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            Architectural Model Viewer
          </h1>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 h-[calc(100vh-120px)]">
            <BoxViewer 
              dimensions={dimensions} 
              boxColor={boxColor}
              objectName={objectName}
              transformMode={transformMode}
              sunlight={sunlight}
              ambientLight={ambientLight}
              shadowQuality={shadowQuality}
              environment={environment}
            />
          </div>
        </div>

        {/* Fixed Right Panel - Always visible */}
        <div className="w-80 xl:w-96 bg-slate-800/60 backdrop-blur-sm border-l border-slate-700/50 overflow-y-auto">
          <div className="p-4 space-y-6">
            <LightingControls 
              sunlight={sunlight}
              setSunlight={setSunlight}
              ambientLight={ambientLight}
              setAmbientLight={setAmbientLight}
              shadowQuality={shadowQuality}
              setShadowQuality={setShadowQuality}
            />
            
            <MaterialControls 
              dimensions={dimensions}
              setDimensions={setDimensions}
              boxColor={boxColor}
              setBoxColor={setBoxColor}
              objectName={objectName}
              setObjectName={setObjectName}
            />
            
            <TransformControls 
              transformMode={transformMode}
              setTransformMode={setTransformMode}
            />
            
            <ViewControls 
              environment={environment}
              setEnvironment={setEnvironment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
