
import { useCallback } from 'react';
import { useSceneStateContext } from '../../store/SceneStateContext';
import type { LoadedModel, SunlightSettings, AmbientLightSettings, EnvironmentSettings, BoxDimensions, ShadowQuality } from '../../types/model';

export const useSceneState = () => {
  const { state, dispatch } = useSceneStateContext();

  const setLoadedModels = useCallback((models: LoadedModel[]) => {
    dispatch({ type: 'SET_LOADED_MODELS', payload: models });
  }, [dispatch]);

  const setCurrentModel = useCallback((model: LoadedModel | null) => {
    dispatch({ type: 'SET_CURRENT_MODEL', payload: model });
  }, [dispatch]);

  const setDimensions = useCallback((dimensions: BoxDimensions) => {
    dispatch({ type: 'SET_DIMENSIONS', payload: dimensions });
  }, [dispatch]);

  const setBoxColor = useCallback((color: string) => {
    dispatch({ type: 'SET_BOX_COLOR', payload: color });
  }, [dispatch]);

  const setObjectName = useCallback((name: string) => {
    dispatch({ type: 'SET_OBJECT_NAME', payload: name });
  }, [dispatch]);

  const setSunlight = useCallback((sunlight: SunlightSettings) => {
    dispatch({ type: 'SET_SUNLIGHT', payload: sunlight });
  }, [dispatch]);

  const setAmbientLight = useCallback((ambientLight: AmbientLightSettings) => {
    dispatch({ type: 'SET_AMBIENT_LIGHT', payload: ambientLight });
  }, [dispatch]);

  const setShadowQuality = useCallback((quality: ShadowQuality) => {
    dispatch({ type: 'SET_SHADOW_QUALITY', payload: quality });
  }, [dispatch]);

  const setEnvironment = useCallback((environment: EnvironmentSettings) => {
    dispatch({ type: 'SET_ENVIRONMENT', payload: environment });
  }, [dispatch]);

  const setUploading = useCallback((uploading: boolean) => {
    dispatch({ type: 'SET_UPLOADING', payload: uploading });
  }, [dispatch]);

  const setUploadError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_UPLOAD_ERROR', payload: error });
  }, [dispatch]);

  return {
    ...state,
    setLoadedModels,
    setCurrentModel,
    setDimensions,
    setBoxColor,
    setObjectName,
    setSunlight,
    setAmbientLight,
    setShadowQuality,
    setEnvironment,
    setUploading,
    setUploadError
  };
};
