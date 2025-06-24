
import { useState } from 'react';
import { useResponsiveMode } from '../hooks/useResponsiveMode';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import BoxViewer from '../components/BoxViewer';
import TabsControlPanel from '../components/TabsControlPanel/TabsControlPanel';
import { useToast } from '@/hooks/use-toast';

interface LoadedModel {
  id: string;
  name: string;
  object: THREE.Group;
  boundingBox: THREE.Box3;
  size: number;
}

const Index = () => {
  const { isMobile, panelWidth } = useResponsiveMode();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const { toast } = useToast();

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

  // Model states - these will be managed by ThreeViewer internally
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      toast({
        title: "Loading model...",
        description: `Processing ${file.name}`,
      });

      // The actual FBX loading will be handled by the useFBXLoader hook in ThreeViewer
      setIsUploading(false);
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = 'Failed to load model. Please check the file format.';
      setUploadError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleModelsChange = (models: LoadedModel[], current: LoadedModel | null) => {
    setLoadedModels(models);
    setCurrentModel(current);
  };

  const handleModelSelect = (modelId: string) => {
    const model = loadedModels.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model);
      toast({
        title: "Model selected",
        description: `Now viewing ${model.name}`,
      });
    }
  };

  const handleModelRemove = (modelId: string) => {
    const model = loadedModels.find(m => m.id === modelId);
    if (model) {
      if (currentModel?.id === modelId) {
        setCurrentModel(null);
      }
      setLoadedModels(prev => prev.filter(m => m.id !== modelId));
      toast({
        title: "Model removed",
        description: `${model.name} has been removed`,
      });
    }
  };

  const handlePrimitiveSelect = (type: string) => {
    if (type === 'box') {
      setCurrentModel(null);
      toast({
        title: "Primitive selected",
        description: "Now showing box primitive",
      });
    }
  };

  const ControlsPanel = () => (
    <TabsControlPanel
      loadedModels={loadedModels}
      currentModel={currentModel}
      isUploading={isUploading}
      uploadError={uploadError}
      onFileUpload={handleFileUpload}
      onModelSelect={handleModelSelect}
      onModelRemove={handleModelRemove}
      onPrimitiveSelect={handlePrimitiveSelect}
      sunlight={sunlight}
      setSunlight={setSunlight}
      ambientLight={ambientLight}
      setAmbientLight={setAmbientLight}
      shadowQuality={shadowQuality}
      setShadowQuality={setShadowQuality}
      dimensions={dimensions}
      setDimensions={setDimensions}
      boxColor={boxColor}
      setBoxColor={setBoxColor}
      objectName={objectName}
      setObjectName={setObjectName}
      transformMode={transformMode}
      setTransformMode={setTransformMode}
      environment={environment}
      setEnvironment={setEnvironment}
    />
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
              onFileUpload={handleFileUpload}
              onModelsChange={handleModelsChange}
              loadedModels={loadedModels}
              currentModel={currentModel}
              showPrimitives={!currentModel}
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
