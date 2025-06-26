import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SelectionProvider } from '../contexts/SelectionContext';
import { useModelState } from '../hooks/useModelState';
import { useLightingState } from '../hooks/useLightingState';
import { useEnvironmentState } from '../hooks/useEnvironmentState';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useMeasurements } from '../hooks/useMeasurements';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import FloatingPanel from '../components/FloatingPanel/FloatingPanel';
import FloatingZoomControls from '../components/FloatingZoomControls/FloatingZoomControls';
import AidToolsBar from '../components/AidToolsBar/AidToolsBar';
import MeasureToolsPanel from '../components/MeasureToolsPanel/MeasureToolsPanel';
import SettingsPanel from '../components/SettingsPanel/SettingsPanel';
import TabsControlPanel from '../components/TabsControlPanel/TabsControlPanel';
import type { LoadedModel } from '../types/model';
import * as THREE from 'three';

const Index = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [showMeasurePanel, setShowMeasurePanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'point' | 'measure' | 'move'>('select');
  const [settings, setSettings] = useState({
    gridSize: 10,
    snapToGrid: false,
    showAxes: true,
    renderQuality: 'medium' as 'low' | 'medium' | 'high',
    shadowQuality: 'medium' as 'low' | 'medium' | 'high'
  });
  
  const { toast } = useToast();
  const modelState = useModelState();
  const lightingState = useLightingState();
  const environmentState = useEnvironmentState();
  const { measurements, addMeasurement, removeMeasurement, clearAllMeasurements } = useMeasurements();

  const handleToolSelect = (tool: 'select' | 'point' | 'measure' | 'move') => {
    setActiveTool(tool);
    if (tool === 'measure') {
      setShowMeasurePanel(true);
    }
  };

  const handlePointCreate = (point: { x: number; y: number; z: number }) => {
    console.log('Point created:', point);
    toast({
      title: "Point added",
      description: `Position: (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`,
    });
  };

  const handleMeasureCreate = (start: THREE.Vector3, end: THREE.Vector3) => {
    const measurement = addMeasurement(start, end);
    toast({
      title: "Measurement added",
      description: `Distance: ${measurement.distance.toFixed(3)} units`,
    });
  };

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

  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
  };

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
    measurements: measurements,
    onRemoveMeasurement: removeMeasurement,
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
            activeTool={activeTool}
            onPointCreate={handlePointCreate}
            onMeasureCreate={handleMeasureCreate}
          />
        </div>

        {/* Aid Tools Bar */}
        <AidToolsBar
          onToolSelect={handleToolSelect}
          activeTool={activeTool}
        />

        {/* Floating zoom controls */}
        <FloatingZoomControls
          onZoomAll={handleZoomAll}
          onZoomToSelected={handleZoomToSelected}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />

        {/* Measure Tools Panel */}
        <MeasureToolsPanel
          measurements={measurements}
          onClearAll={clearAllMeasurements}
          onRemoveMeasurement={removeMeasurement}
          visible={showMeasurePanel}
          onClose={() => setShowMeasurePanel(false)}
        />

        {/* Settings Panel */}
        <SettingsPanel
          visible={showSettingsPanel}
          onClose={() => setShowSettingsPanel(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />

        {/* Floating control panel */}
        {showControlPanel && (
          <FloatingPanel
            title="Controls"
            defaultPosition={{ x: Math.max(20, window.innerWidth - 360), y: 20 }}
            defaultSize={{ width: 340, height: 600 }}
            onClose={() => setShowControlPanel(false)}
            collapsible={true}
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

        {/* Settings toggle button */}
        <button
          onClick={toggleSettingsPanel}
          className="fixed top-4 right-16 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 z-40"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Keyboard shortcuts help */}
        <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-xs text-slate-400 z-40">
          <div>Tab: Toggle Panel | A: Zoom All | F: Focus | R: Reset</div>
        </div>
      </div>
    </SelectionProvider>
  );
};

export default Index;
