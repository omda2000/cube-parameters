
import React from 'react';
import TabsControlPanel from '../TabsControlPanel/TabsControlPanel';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  BoxDimensions, 
  ShadowQuality 
} from '../../types/model';

interface FixedControlPanelProps {
  visible: boolean;
  activeTab: string;
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
  shadowQuality: ShadowQuality;
  setShadowQuality: (quality: ShadowQuality) => void;
  dimensions: BoxDimensions;
  setDimensions: (dimensions: BoxDimensions) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
  scene?: THREE.Scene | null;
}

const FixedControlPanel = ({ visible, activeTab, ...props }: FixedControlPanelProps) => {
  if (!visible) return null;

  return (
    <div className="fixed right-20 top-20 w-96 h-[calc(100vh-6rem)] bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden z-30 transition-all duration-300">
      <div className="h-full overflow-y-auto p-3">
        <TabsControlPanel {...props} activeTab={activeTab} />
      </div>
    </div>
  );
};

export default FixedControlPanel;
