
import SceneTab from './tabs/SceneTab';
import PropertiesTab from './tabs/PropertiesTab';
import LightingTab from './tabs/LightingTab';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import HelpPanel from '../HelpPanel/HelpPanel';
import * as THREE from 'three';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings 
} from '../../types/model';
import type { ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

interface TabsControlPanelProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  isUploading: boolean;
  uploadError: string | null;
  onFileUpload: (file: File) => void;
  onModelSelect: (modelId: string) => void;
  onModelRemove: (modelId: string) => void;
  onPrimitiveSelect: (type: string) => void;
  
  sunlight: SunlightSettings;
  setSunlight: (settings: SunlightSettings) => void;
  ambientLight: AmbientLightSettings;
  setAmbientLight: (settings: AmbientLightSettings) => void;
  shadowQuality: 'low' | 'medium' | 'high';
  setShadowQuality: (quality: 'low' | 'medium' | 'high') => void;
  
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
  
  shadeType?: ShadeType;
  onShadeTypeChange?: (type: ShadeType) => void;
  
  scene?: THREE.Scene | null;
  
  activeTab: string;
}

const TabsControlPanel = ({
  loadedModels,
  currentModel,
  isUploading,
  uploadError,
  onFileUpload,
  sunlight,
  setSunlight,
  ambientLight,
  setAmbientLight,
  shadowQuality,
  setShadowQuality,
  environment,
  setEnvironment,
  shadeType = 'shaded',
  onShadeTypeChange,
  scene,
  activeTab,
  isOrthographic,
  onCameraToggle
}: TabsControlPanelProps & {
  isOrthographic?: boolean;
  onCameraToggle?: (orthographic: boolean) => void;
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'scene':
        return (
          <SceneTab
            loadedModels={loadedModels}
            currentModel={currentModel}
            isUploading={isUploading}
            uploadError={uploadError}
            onFileUpload={onFileUpload}
            scene={scene}
          />
        );
      case 'properties':
        return <PropertiesTab />;
      case 'lighting':
        return (
          <LightingTab
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
      case 'environment':
        return <div className="p-4 text-center text-muted-foreground">Environment settings have been moved to other panels</div>;
      case 'help':
        return <HelpPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default TabsControlPanel;
