
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import type { LoadedModel } from '../types/model';

interface FileHandlersProps {
  setLoadedModels: (models: LoadedModel[]) => void;
  setCurrentModel: (model: LoadedModel | null) => void;
  setUploading: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;
  loadedModels: LoadedModel[];
}

export const useFileHandlers = ({
  setLoadedModels,
  setCurrentModel,
  setUploading,
  setUploadError,
  loadedModels
}: FileHandlersProps) => {
  const { toast } = useToast();
  const { addMessage } = useNotifications();

  const handleFileUpload = async (file: File) => {
    try {
      addMessage({
        type: 'info',
        title: 'Loading model...',
        description: `Processing ${file.name}`,
      });

      const fbxUploadHandler = (window as any).__fbxUploadHandler;
      if (fbxUploadHandler) {
        await fbxUploadHandler(file);
        addMessage({
          type: 'success',
          title: 'Model loaded successfully',
          description: `${file.name} is now ready`,
        });
      } else {
        throw new Error('FBX loader not ready');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      addMessage({
        type: 'error',
        title: 'Upload failed',
        description: 'Failed to load model. Please check the file format.',
      });
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
