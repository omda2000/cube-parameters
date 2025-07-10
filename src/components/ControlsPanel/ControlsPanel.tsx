
import TabsControlPanel from '../TabsControlPanel/TabsControlPanel';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  BoxDimensions, 
  ShadowQuality 
} from '../../types/model';

interface ControlsPanelProps {
  panelWidth: number;
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
  activeTab: string;
}

const ControlsPanel = ({ panelWidth, activeTab, ...props }: ControlsPanelProps) => {
  return (
    <div 
      className="bg-slate-800/60 backdrop-blur-sm border-l border-slate-700/50 overflow-hidden"
      style={{ width: panelWidth }}
    >
      <TabsControlPanel {...props} activeTab={activeTab} />
    </div>
  );
};

export default ControlsPanel;
