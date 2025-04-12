
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
  const [showEdges, setShowEdges] = useState(false);
  const [boxColor, setBoxColor] = useState('#4F46E5');
  const [objectName, setObjectName] = useState('My Box');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">3D Box Visualizer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50" style={{ minHeight: '550px' }}>
            <BoxViewer 
              dimensions={dimensions} 
              showShadow={showShadow}
              showEdges={showEdges}
              boxColor={boxColor}
              objectName={objectName}
            />
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-700/50">
            <BoxControls 
              dimensions={dimensions} 
              setDimensions={setDimensions} 
              showShadow={showShadow}
              setShowShadow={setShowShadow}
              showEdges={showEdges}
              setShowEdges={setShowEdges}
              boxColor={boxColor}
              setBoxColor={setBoxColor}
              objectName={objectName}
              setObjectName={setObjectName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
