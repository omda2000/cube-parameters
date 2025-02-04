import { useState } from 'react';
import BoxViewer from '../components/BoxViewer';
import BoxControls from '../components/BoxControls';

const Index = () => {
  const [dimensions, setDimensions] = useState({
    length: 1,
    width: 1,
    height: 1
  });
  const [showShadow, setShowShadow] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">3D Box Visualizer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden" style={{ minHeight: '500px' }}>
            <BoxViewer dimensions={dimensions} showShadow={showShadow} />
          </div>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <BoxControls 
              dimensions={dimensions} 
              setDimensions={setDimensions} 
              showShadow={showShadow}
              setShowShadow={setShowShadow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;