
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Sun, Palette, Eye, Settings } from 'lucide-react';
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

interface TabsControlPanelProps {
  // Model management
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  isUploading: boolean;
  uploadError: string | null;
  onFileUpload: (file: File) => void;
  onModelSelect: (modelId: string) => void;
  onModelRemove: (modelId: string) => void;
  onPrimitiveSelect: (type: string) => void;
  
  // Lighting
  sunlight: SunlightSettings;
  setSunlight: (settings: SunlightSettings) => void;
  ambientLight: AmbientLightSettings;
  setAmbientLight: (settings: AmbientLightSettings) => void;
  shadowQuality: 'low' | 'medium' | 'high';
  setShadowQuality: (quality: 'low' | 'medium' | 'high') => void;
  
  // Materials
  dimensions: { length: number; width: number; height: number };
  setDimensions: (dimensions: { length: number; width: number; height: number }) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
  
  // Environment
  environment: EnvironmentSettings;
  setEnvironment: (settings: EnvironmentSettings) => void;
  
  // Scene reference
  scene?: THREE.Scene | null;

  // Measurements and points
  measurements?: Array<{
    id: string;
    startPoint: { x: number; y: number; z: number };
    endPoint: { x: number; y: number; z: number };
    distance: number;
    label: string;
  }>;
  points?: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    name: string;
  }>;
  onRemoveMeasurement?: (id: string) => void;
  onRemovePoint?: (id: string) => void;
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
  scene,
  measurements,
  points,
  onRemoveMeasurement,
  onRemovePoint
}: TabsControlPanelProps) => {
  const [activeTab, setActiveTab] = useState('scene');
  const [settings, setSettings] = useState({
    units: 'metric' as 'metric' | 'imperial' | 'custom',
    precision: 2,
    showGrid: true,
    showAxes: true,
    snapToGrid: false
  });

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-700/50 h-12">
          <TabsTrigger 
            value="scene" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Box className="h-3 w-3" />
            <span>Scene</span>
          </TabsTrigger>
          <TabsTrigger 
            value="properties" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Eye className="h-3 w-3" />
            <span>Props</span>
          </TabsTrigger>
          <TabsTrigger 
            value="lighting" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Sun className="h-3 w-3" />
            <span>Lighting</span>
          </TabsTrigger>
          <TabsTrigger 
            value="materials" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Palette className="h-3 w-3" />
            <span>Material</span>
          </TabsTrigger>
          <TabsTrigger 
            value="view" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Eye className="h-3 w-3" />
            <span>View</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Settings className="h-3 w-3" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scene" className="space-y-4 mt-4">
          <SceneTab
            loadedModels={loadedModels}
            currentModel={currentModel}
            isUploading={isUploading}
            uploadError={uploadError}
            onFileUpload={onFileUpload}
            scene={scene}
            measurements={measurements}
            points={points}
            onRemoveMeasurement={onRemoveMeasurement}
            onRemovePoint={onRemovePoint}
          />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4 mt-4">
          <PropertiesTab />
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4 mt-4">
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
        </TabsContent>

        <TabsContent value="materials" className="space-y-4 mt-4">
          <MaterialsTab
            dimensions={dimensions}
            setDimensions={setDimensions}
            boxColor={boxColor}
            setBoxColor={setBoxColor}
            objectName={objectName}
            setObjectName={setObjectName}
          />
        </TabsContent>

        <TabsContent value="view" className="space-y-4 mt-4">
          <ViewTab
            environment={environment}
            setEnvironment={setEnvironment}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <SettingsTab
            settings={settings}
            onSettingsChange={setSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsControlPanel;
