
import { useState } from 'react';
import type { EnvironmentSettings } from '../types/model';

export const useEnvironmentState = () => {
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    showGrid: true,
    groundColor: '#4a5568',
    skyColor: '#1a202c',
    showGround: true,
    preset: 'studio',
    background: 'gradient',
    cameraFov: 75
  });

  return {
    environment,
    setEnvironment
  };
};
