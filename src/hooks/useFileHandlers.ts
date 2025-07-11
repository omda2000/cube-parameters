
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
    console.log('Starting file upload process:', {
      name: file.name,
      type: file.type,
      size: file.size,
      userAgent: navigator.userAgent
    });

    try {
      setUploading(true);
      setUploadError(null);

      addMessage({
        type: 'info',
        title: 'Loading model...',
        description: `Processing ${file.name}`,
      });

      // Determine file type and use appropriate loader
      const fileName = file.name.toLowerCase();
      let uploadHandler = null;

      if (fileName.endsWith('.fbx')) {
        uploadHandler = (window as any).__fbxUploadHandler;
        console.log('Using FBX loader for:', file.name);
      } else if (fileName.endsWith('.gltf') || fileName.endsWith('.glb')) {
        uploadHandler = (window as any).__gltfUploadHandler;
        console.log('Using GLTF loader for:', file.name);
      } else if (fileName.endsWith('.obj')) {
        uploadHandler = (window as any).__objUploadHandler || (window as any).__fbxUploadHandler;
        console.log('Using OBJ loader (fallback to FBX) for:', file.name);
      } else {
        throw new Error('Unsupported file format. Please select FBX, GLTF, GLB, or OBJ files.');
      }

      if (uploadHandler) {
        console.log('Upload handler found, processing file...');
        await uploadHandler(file);
        
        addMessage({
          type: 'success',
          title: 'Model loaded successfully',
          description: `${file.name} is now ready`,
        });
        
        console.log('File upload completed successfully');
      } else {
        throw new Error('No suitable loader found for this file type');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setUploadError(`Failed to load ${file.name}: ${errorMessage}`);
      
      addMessage({
        type: 'error',
        title: 'Upload failed',
        description: `Failed to load ${file.name}. ${errorMessage}`,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleModelsChange = (models: LoadedModel[], current: LoadedModel | null) => {
    console.log('Models changed:', { modelCount: models.length, currentModel: current?.name });
    setLoadedModels(models);
    setCurrentModel(current);
  };

  const handleModelSelect = (modelId: string) => {
    const model = loadedModels.find((m: LoadedModel) => m.id === modelId);
    if (model) {
      console.log('Selecting model:', model.name);
      const fbxSwitchHandler = (window as any).__fbxSwitchHandler;
      const gltfSwitchHandler = (window as any).__gltfSwitchHandler;
      
      // Try both handlers (they're the same unified handler now)
      if (fbxSwitchHandler) {
        fbxSwitchHandler(modelId);
      } else if (gltfSwitchHandler) {
        gltfSwitchHandler(modelId);
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
      console.log('Removing model:', model.name);
      const fbxRemoveHandler = (window as any).__fbxRemoveHandler;
      const gltfRemoveHandler = (window as any).__gltfRemoveHandler;
      
      // Try both handlers (they're the same unified handler now)
      if (fbxRemoveHandler) {
        fbxRemoveHandler(modelId);
      } else if (gltfRemoveHandler) {
        gltfRemoveHandler(modelId);
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
      console.log('Selecting box primitive');
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
