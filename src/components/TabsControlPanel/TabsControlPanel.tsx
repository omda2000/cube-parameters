import SceneTab from './tabs/SceneTab';
import PropertiesTab from './tabs/PropertiesTab';
import LightingTab from './tabs/LightingTab';
import MaterialsTab from './tabs/MaterialsTab';
import ViewTab from './tabs/ViewTab';
import SettingsTab from './tabs/SettingsTab';
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
  
  dimensions: { length: number; width: number; height: number };
  setDimensions: (dimensions: { length: number; width: number; height: number }) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
  
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
  dimensions,
  setDimensions,
  boxColor,
  setBoxColor,
  objectName,
  setObjectName,
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
      case 'materials':
        return (
          <MaterialsTab
            dimensions={dimensions}
            setDimensions={setDimensions}
            boxColor={boxColor}
            setBoxColor={setBoxColor}
            objectName={objectName}
            setObjectName={setObjectName}
          />
        );
      case 'environment':
        return (
          <ViewTab
            environment={environment}
            setEnvironment={setEnvironment}
            isOrthographic={isOrthographic}
            onCameraToggle={onCameraToggle}
          />
        );
      case 'settings':
        return <SettingsTab />;
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
