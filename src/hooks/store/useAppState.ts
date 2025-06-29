
import { useCallback } from 'react';
import { useAppStateContext } from '../../store/AppStateContext';
import * as THREE from 'three';

export const useAppState = () => {
  const { state, dispatch } = useAppStateContext();

  const setScene = useCallback((scene: THREE.Scene | null) => {
    dispatch({ type: 'SET_SCENE', payload: scene });
  }, [dispatch]);

  const setInitialized = useCallback((initialized: boolean) => {
    dispatch({ type: 'SET_INITIALIZED', payload: initialized });
  }, [dispatch]);

  return {
    scene: state.scene,
    isInitialized: state.isInitialized,
    setScene,
    setInitialized
  };
};
