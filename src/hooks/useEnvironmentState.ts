
import { useState } from 'react';
import type { EnvironmentSettings } from '../types/model';

export const useEnvironmentState = () => {
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    showGrid: true,
    groundColor: '#444444',
    skyColor: '#87CEEB',
    showGround: true,
    enableEnvironment: true
  });

  return {
    environment,
    setEnvironment
  };
};
