
import { useState } from 'react';
import { useResponsiveMode } from '../hooks/useResponsiveMode';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import BoxViewer from '../components/BoxViewer';
import LightingControls from '../components/LightingControls';
import MaterialControls from '../components/MaterialControls';
import ViewControls from '../components/ViewControls';
import TransformControls from '../components/TransformControls';
import FileUploadDialog from '../components/FileUpload/FileUploadDialog';
import ModelManager from '../components/ModelManager/ModelManager';

const Index = () => {
  const { isMobile, panelWidth } = useResponsiveMode();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

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

  // File upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // For now, we'll just simulate upload - the actual FBX loading will be handled in the viewer
      console.log('Uploading file:', file.name);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
      
      // TODO: Pass file to the viewer component for actual loading
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload model');
    } finally {
      setIsUploading(false);
    }
  };

  const ControlsPanel = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <FileUploadDialog 
          onFileSelect={handleFileUpload} 
          isLoading={isUploading}
        />
      </div>

      {uploadError && (
        <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-200 text-sm">
          {uploadError}
        </div>
      )}

      <ModelManager
        loadedModels={[]}
        currentModel={null}
        onModelSelect={() => {}}
        onModelRemove={() => {}}
        onPrimitiveSelect={() => {}}
      />
      
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex h-screen">
        {/* Main 3D Viewer */}
        <div className="flex-1 p-2 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              Architectural Model Viewer
            </h1>
            
            {isMobile && (
              <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-slate-800/95 border-slate-700/50 overflow-y-auto">
                  <div className="p-4">
                    <ControlsPanel />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)]">
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

        {/* Desktop Controls Panel */}
        {!isMobile && (
          <div 
            className="bg-slate-800/60 backdrop-blur-sm border-l border-slate-700/50 overflow-y-auto"
            style={{ width: panelWidth }}
          >
            <div className="p-4">
              <ControlsPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
