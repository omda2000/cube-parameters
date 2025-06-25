
import LightingControls from '../../LightingControls';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings 
} from '../../../types/model';

interface LightingTabProps {
  sunlight: SunlightSettings;
  setSunlight: (settings: SunlightSettings) => void;
  ambientLight: AmbientLightSettings;
  setAmbientLight: (settings: AmbientLightSettings) => void;
  shadowQuality: 'low' | 'medium' | 'high';
  setShadowQuality: (quality: 'low' | 'medium' | 'high') => void;
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
}

const LightingTab = ({
  sunlight,
  setSunlight,
  ambientLight,
  setAmbientLight,
  shadowQuality,
  setShadowQuality,
  environment,
  setEnvironment
}: LightingTabProps) => {
  return (
    <LightingControls 
      sunlight={sunlight}
      setSunlight={setSunlight}
      ambientLight={ambientLight}
      setAmbientLight={setAmbientLight}
      shadowQuality={shadowQuality}
      setShadowQuality={setShadowQuality}
      environment={environment}
      setEnvironment={setEnvironment}
    />
  );
};

export default LightingTab;
