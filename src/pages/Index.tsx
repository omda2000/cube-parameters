
import { useState } from 'react';
import { useResponsiveMode } from '../hooks/useResponsiveMode';
import { useModelState } from '../hooks/useModelState';
import { useLightingState } from '../hooks/useLightingState';
import { useEnvironmentState } from '../hooks/useEnvironmentState';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '../components/AppHeader/AppHeader';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import ControlsPanel from '../components/ControlsPanel/ControlsPanel';
import TabsControlPanel from '../components/TabsControlPanel/TabsControlPanel';
import type { LoadedModel } from '../types/model';

const Index = () => {
  const { isMobile, panelWidth } = useResponsiveMode();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
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

      // Call the FBX loader directly through the global handler
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
      // Call the FBX loader's switch function through global handler
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
      // Call the FBX loader's remove function through global handler
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

  const controlsPanelProps = {
    loadedModels: modelState.loadedModels,
    currentModel: modelState.currentModel,
    isUploading: modelState.isUploading,
    uploadError: modelState.uploadError,
    onFileUpload: handleFileUpload,
    onModelSelect: handleModelSelect,
    onModelRemove: handleModelRemove,
    onPrimitiveSelect: handlePrimitiveSelect,
    ...lightingState,
    ...modelState,
    ...environmentState
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex h-screen">
        <div className="flex-1 p-2 sm:p-4">
          <AppHeader
            isMobile={isMobile}
            mobileSheetOpen={mobileSheetOpen}
            setMobileSheetOpen={setMobileSheetOpen}
          >
            <TabsControlPanel {...controlsPanelProps} />
          </AppHeader>
          
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
          />
        </div>

        {!isMobile && (
          <ControlsPanel
            panelWidth={panelWidth}
            {...controlsPanelProps}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
