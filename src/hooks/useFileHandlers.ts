
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useSceneState } from '../store/useAppStore';
import type { LoadedModel } from '../types/model';
import { logger } from '../lib/logger';
import { useModelViewerContext } from '../contexts/ModelViewerContext';

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
  const { onFileUpload, onModelSelect, onModelRemove } = useModelViewerContext();

  const handleFileUpload = async (file: File) => {
    logger.info('Starting file upload process:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Use context-based handler if available
    if (onFileUpload) {
      return onFileUpload(file);
    }

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
        logger.debug('Using FBX loader for:', file.name);
      } else if (fileName.endsWith('.gltf') || fileName.endsWith('.glb')) {
        uploadHandler = (window as any).__gltfUploadHandler;
        logger.debug('Using GLTF loader for:', file.name);
      } else if (fileName.endsWith('.obj')) {
        uploadHandler = (window as any).__objUploadHandler || (window as any).__fbxUploadHandler;
        logger.debug('Using OBJ loader (fallback to FBX) for:', file.name);
      } else {
        throw new Error('Unsupported file format. Please select FBX, GLTF, GLB, or OBJ files.');
      }

      if (uploadHandler) {
        logger.debug('Upload handler found, processing file...');
        await uploadHandler(file);
        
        addMessage({
          type: 'success',
          title: 'Model loaded successfully',
          description: `${file.name} is now ready`,
        });
        
        logger.info('File upload completed successfully');
      } else {
        throw new Error('No suitable loader found for this file type');
      }
      
    } catch (error) {
      logger.error('Upload failed:', error);
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
    logger.info('Models changed:', { modelCount: models.length, currentModel: current?.name });
    setLoadedModels(models);
    setCurrentModel(current);
  };

  const handleModelSelect = (modelId: string) => {
    const model = loadedModels.find((m: LoadedModel) => m.id === modelId);
    if (model) {
      logger.info('Selecting model:', model.name);
      
      // Use context-based handler if available, fallback to global handlers
      if (onModelSelect) {
        onModelSelect(modelId);
      } else {
        const fbxSwitchHandler = (window as any).__fbxSwitchHandler;
        const gltfSwitchHandler = (window as any).__gltfSwitchHandler;
        
        if (fbxSwitchHandler) {
          fbxSwitchHandler(modelId);
        } else if (gltfSwitchHandler) {
          gltfSwitchHandler(modelId);
        }
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
      logger.info('Removing model:', model.name);
      
      // Use context-based handler if available, fallback to global handlers
      if (onModelRemove) {
        onModelRemove(modelId);
      } else {
        const fbxRemoveHandler = (window as any).__fbxRemoveHandler;
        const gltfRemoveHandler = (window as any).__gltfRemoveHandler;
        
        if (fbxRemoveHandler) {
          fbxRemoveHandler(modelId);
        } else if (gltfRemoveHandler) {
          gltfRemoveHandler(modelId);
        }
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
      logger.info('Selecting box primitive');
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
