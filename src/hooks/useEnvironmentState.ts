
import { useState } from 'react';
import type { EnvironmentSettings } from '../types/model';

export const useEnvironmentState = () => {
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    showGrid: true,
    groundColor: '#808080',
    skyColor: '#87CEEB'
  });

  return {
    environment,
    setEnvironment
  };
};
