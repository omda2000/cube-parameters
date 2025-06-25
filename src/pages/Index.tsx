
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SelectionProvider } from '../contexts/SelectionContext';
import { useModelState } from '../hooks/useModelState';
import { useLightingState } from '../hooks/useLightingState';
import { useEnvironmentState } from '../hooks/useEnvironmentState';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import FloatingPanel from '../components/FloatingPanel/FloatingPanel';
import FloatingZoomControls from '../components/FloatingZoomControls/FloatingZoomControls';
import TabsControlPanel from '../components/TabsControlPanel/TabsControlPanel';
import type { LoadedModel } from '../types/model';

const Index = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const { toast } = useToast();

  const modelState = useModelState();
  const lightingState = useLightingState();
  const environmentState = useEnvironmentState();

  const handleFileUpload = async (file: File) => {
    try {
      toast({
        title: "Loading model...",
        description: `Processing ${file.name}`,
      });

      const fbxUploadHandler = (window as any).__fbxUploadHandler;
      if (fbxUploadHandler) {
        await fbxUploadHandler(file);
        toast({
          title: "Model loaded successfully",
          description: `${file.name} is now ready`,
        });
      } else {
        throw new Error('FBX loader not ready');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to load model. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleModelsChange = (models: LoadedModel[], current: LoadedModel | null) => {
    modelState.setLoadedModels(models);
    modelState.setCurrentModel(current);
  };

  const handleModelSelect = (modelId: string) => {
    const model = modelState.loadedModels.find(m => m.id === modelId);
    if (model) {
      const fbxSwitchHandler = (window as any).__fbxSwitchHandler;
      if (fbxSwitchHandler) {
        fbxSwitchHandler(modelId);
      }
      toast({
        title: "Model selected",
        description: `Now viewing ${model.name}`,
      });
    }
  };

  const handleModelRemove = (modelId: string) => {
    const model = modelState.loadedModels.find(m => m.id === modelId);
    if (model) {
      const fbxRemoveHandler = (window as any).__fbxRemoveHandler;
      if (fbxRemoveHandler) {
        fbxRemoveHandler(modelId);
      }
      toast({
        title: "Model removed",
        description: `${model.name} has been removed`,
      });
    }
  };

  const handlePrimitiveSelect = (type: string) => {
    if (type === 'box') {
      modelState.setCurrentModel(null);
      toast({
        title: "Primitive selected",
        description: "Now showing box primitive",
      });
    }
  };

  // Zoom control handlers
  const handleZoomAll = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      zoomControls.zoomAll();
    }
  };

  const handleZoomToSelected = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      zoomControls.zoomToSelected();
    }
  };

  const handleZoomIn = () => {
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    console.log('Zoom out');
  };

  const handleResetView = () => {
    console.log('Reset view');
  };

  const toggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleControlPanel: toggleControlPanel,
    onZoomAll: handleZoomAll,
    onZoomToSelected: handleZoomToSelected,
    onResetView: handleResetView
  });

  const controlsPanelProps = {
    loadedModels: modelState.loadedModels,
    currentModel: modelState.currentModel,
    isUploading: modelState.isUploading,
    uploadError: modelState.uploadError,
    onFileUpload: handleFileUpload,
    onModelSelect: handleModelSelect,
    onModelRemove: handleModelRemove,
    onPrimitiveSelect: handlePrimitiveSelect,
    scene: scene,
    ...lightingState,
    ...modelState,
    ...environmentState
  };

  return (
    <SelectionProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Full-screen canvas */}
        <div className="absolute inset-0">
          <ModelViewerContainer
            dimensions={modelState.dimensions}
            boxColor={modelState.boxColor}
            objectName={modelState.objectName}
            sunlight={lightingState.sunlight}
            ambientLight={lightingState.ambientLight}
            shadowQuality={lightingState.shadowQuality}
            environment={environmentState.environment}
            loadedModels={modelState.loadedModels}
            currentModel={modelState.currentModel}
            onFileUpload={handleFileUpload}
            onModelsChange={handleModelsChange}
            onSceneReady={setScene}
          />
        </div>

        {/* Floating zoom controls */}
        <FloatingZoomControls
          onZoomAll={handleZoomAll}
          onZoomToSelected={handleZoomToSelected}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />

        {/* Floating control panel */}
        {showControlPanel && (
          <FloatingPanel
            title="Controls"
            defaultPosition={{ x: Math.max(20, window.innerWidth - 360), y: 20 }}
            defaultSize={{ width: 340, height: 600 }}
            onClose={() => setShowControlPanel(false)}
          >
            <TabsControlPanel {...controlsPanelProps} />
          </FloatingPanel>
        )}

        {/* Panel toggle button (when panel is closed) */}
        {!showControlPanel && (
          <button
            onClick={toggleControlPanel}
            className="fixed top-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 z-40"
            title="Show Controls (Tab)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        )}

        {/* Keyboard shortcuts help */}
        <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-xs text-slate-400 z-40">
          <div>Tab: Toggle Panel | A: Zoom All | F: Focus | R: Reset</div>
        </div>
      </div>
    </SelectionProvider>
  );
};

export default Index;
