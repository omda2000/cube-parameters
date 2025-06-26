
import { useState } from 'react';

interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
  showGround: boolean;
}

export const useEnvironmentState = () => {
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    showGrid: true,
    groundColor: '#4a5568',
    skyColor: '#1a202c',
    showGround: true
  });

  return {
    environment,
    setEnvironment
  };
};
