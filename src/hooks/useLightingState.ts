
import { useState } from 'react';
import type { SunlightSettings, AmbientLightSettings, ShadowQuality } from '../types/model';

export const useLightingState = () => {
  const [sunlight, setSunlight] = useState<SunlightSettings>({
    intensity: 1,
    azimuth: 45,
    elevation: 45,
    color: '#ffffff',
    castShadow: true
  });
  
  const [ambientLight, setAmbientLight] = useState<AmbientLightSettings>({
    intensity: 0.3,
    color: '#ffffff'
  });
  
  const [shadowQuality, setShadowQuality] = useState<ShadowQuality>('medium');

  return {
    sunlight,
    setSunlight,
    ambientLight,
    setAmbientLight,
    shadowQuality,
    setShadowQuality
  };
};
