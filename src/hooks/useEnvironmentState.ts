
import { useState } from 'react';

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
  showGround: boolean;
  preset?: string;
  background?: 'gradient' | 'solid' | 'transparent';
  cameraFov?: number;
  cameraType?: 'perspective' | 'orthographic';
}

export const useEnvironmentState = () => {
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    showGrid: true,
    groundColor: '#4a5568',
    skyColor: '#1a202c',
    showGround: true,
    preset: 'studio',
    background: 'gradient',
    cameraFov: 75,
    cameraType: 'perspective'
  });

  return {
    environment,
    setEnvironment
  };
};
