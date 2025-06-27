
import { useToast } from '@/hooks/use-toast';
import type { LoadedModel } from '../types/model';

export const useFileHandlers = (
  modelState: any
) => {
  const { toast } = useToast();

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
    const model = modelState.loadedModels.find((m: LoadedModel) => m.id === modelId);
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
    const model = modelState.loadedModels.find((m: LoadedModel) => m.id === modelId);
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

  return {
    handleFileUpload,
    handleModelsChange,
    handleModelSelect,
    handleModelRemove,
    handlePrimitiveSelect
  };
};
