import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useSceneState } from '../store/useAppStore';
import type { LoadedModel } from '../types/model';

export const useFileHandlers = () => {
  const { toast } = useToast();
  const { addMessage } = useNotifications();
  const { 
    loadedModels, 
    setLoadedModels, 
    setCurrentModel, 
    setUploading, 
    setUploadError 
  } = useSceneState();

  const handleFileUpload = async (file: File) => {
    console.log('handleFileUpload called with file:', file.name, 'size:', file.size, 'type:', file.type);
    
    try {
      setUploading(true);
      setUploadError(null);
      
      addMessage({
        type: 'info',
        title: 'Loading model...',
        description: `Processing ${file.name}`,
      });

      // Check if file is accessible
      if (!file || file.size === 0) {
        throw new Error('File is empty or not accessible');
      }

      console.log('Checking for FBX upload handler...');
      const fbxUploadHandler = (window as any).__fbxUploadHandler;
      
      if (fbxUploadHandler) {
        console.log('FBX upload handler found, calling with file');
        await fbxUploadHandler(file);
        
        addMessage({
          type: 'success',
          title: 'Model loaded successfully',
          description: `${file.name} is now ready`,
        });
      } else {
        console.error('FBX loader not ready');
        throw new Error('3D viewer not ready. Please wait a moment and try again.');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setUploadError(errorMessage);
      
      addMessage({
        type: 'error',
        title: 'Upload failed',
        description: `Failed to load ${file.name}: ${errorMessage}`,
      });
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleModelsChange = (models: LoadedModel[], current: LoadedModel | null) => {
    setLoadedModels(models);
    setCurrentModel(current);
  };

  const handleModelSelect = (modelId: string) => {
    const model = loadedModels.find((m: LoadedModel) => m.id === modelId);
    if (model) {
      const fbxSwitchHandler = (window as any).__fbxSwitchHandler;
      if (fbxSwitchHandler) {
        fbxSwitchHandler(modelId);
      }
      addMessage({
        type: 'success',
        title: 'Model selected',
        description: `Now viewing ${model.name}`,
      });
    }
  };

  const handleModelRemove = (modelId: string) => {
    const model = loadedModels.find((m: LoadedModel) => m.id === modelId);
    if (model) {
      const fbxRemoveHandler = (window as any).__fbxRemoveHandler;
      if (fbxRemoveHandler) {
        fbxRemoveHandler(modelId);
      }
      addMessage({
        type: 'warning',
        title: 'Model removed',
        description: `${model.name} has been removed`,
      });
    }
  };

  const handlePrimitiveSelect = (type: string) => {
    if (type === 'box') {
      setCurrentModel(null);
      addMessage({
        type: 'info',
        title: 'Primitive selected',
        description: 'Now showing box primitive',
      });
    }
  };

  return {
    handleFileUpload,
    handleModelsChange,
    handleModelSelect,
    handleModelRemove,
    handlePrimitiveSelect
  };
};
