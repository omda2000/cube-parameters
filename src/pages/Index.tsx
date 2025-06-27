
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SelectionProvider } from '../contexts/SelectionContext';
import { useModelState } from '../hooks/useModelState';
import { useLightingState } from '../hooks/useLightingState';
import { useEnvironmentState } from '../hooks/useEnvironmentState';
import { useShadeType } from '../hooks/useShadeType';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useMeasurements } from '../hooks/useMeasurements';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import FloatingPanel from '../components/FloatingPanel/FloatingPanel';
import FloatingZoomControls from '../components/FloatingZoomControls/FloatingZoomControls';
import ControlPanelTabs from '../components/ControlPanelTabs/ControlPanelTabs';
import AidToolsBar from '../components/AidToolsBar/AidToolsBar';
import MeasureToolsPanel from '../components/MeasureToolsPanel/MeasureToolsPanel';
import SettingsPanel from '../components/SettingsPanel/SettingsPanel';
import TabsControlPanel from '../components/TabsControlPanel/TabsControlPanel';
import type { LoadedModel } from '../types/model';
import * as THREE from 'three';
import AppHeader from '../components/AppHeader/AppHeader';
import FixedControlPanel from '../components/FixedControlPanel/FixedControlPanel';

const Index = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showMeasurePanel, setShowMeasurePanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [activeControlTab, setActiveControlTab] = useState('');
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
  const { shadeType, setShadeType } = useShadeType({ current: scene });
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
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls && zoomControls.zoomIn) {
      zoomControls.zoomIn();
    }
  };

  const handleZoomOut = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls && zoomControls.zoomOut) {
      zoomControls.zoomOut();
    }
  };

  const handleResetView = () => {
    const zoomControls = (window as any).__zoomControls;
    if (zoomControls) {
      zoomControls.resetView();
    }
  };

  const toggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };

  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
  };

  const handleTabChange = (tab: string) => {
    if (tab === '') {
      // Empty string means close panel
      setShowControlPanel(false);
      setActiveControlTab('');
    } else {
      // Open panel with selected tab
      setShowControlPanel(true);
      setActiveControlTab(tab);
    }
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
    activeTab: activeControlTab,
    ...lightingState,
    ...modelState,
    ...environmentState
  };

  return (
    <SelectionProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Top Header */}
        <AppHeader
          isMobile={false}
          mobileSheetOpen={false}
          setMobileSheetOpen={() => {}}
          onSettingsClick={toggleSettingsPanel}
        >
          <div></div>
        </AppHeader>

        {/* Full-screen canvas with top padding */}
        <div className="absolute inset-0 pt-20">
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

        {/* Floating zoom controls with shade controls */}
        <FloatingZoomControls
          onZoomAll={handleZoomAll}
          onZoomToSelected={handleZoomToSelected}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          shadeType={shadeType}
          onShadeTypeChange={setShadeType}
        />

        {/* External Control Panel Tabs */}
        <ControlPanelTabs
          activeTab={activeControlTab}
          onTabChange={handleTabChange}
          panelVisible={showControlPanel}
        />

        {/* Fixed Control Panel */}
        <FixedControlPanel
          visible={showControlPanel}
          activeTab={activeControlTab}
          {...controlsPanelProps}
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

        {/* Keyboard shortcuts help */}
        <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 text-xs text-slate-400 z-40">
          <div>Tab: Toggle Panel | A: Zoom All | F: Focus | R: Reset</div>
        </div>
      </div>
    </SelectionProvider>
  );
};

export default Index;
