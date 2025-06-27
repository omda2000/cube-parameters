
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Box, Globe, Palette, Eye, Settings } from 'lucide-react';
import SceneTab from './tabs/SceneTab';
import PropertiesTab from './tabs/PropertiesTab';
import LightingTab from './tabs/LightingTab';
import MaterialsTab from './tabs/MaterialsTab';
import ViewTab from './tabs/ViewTab';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings 
} from '../../types/model';
import type { ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

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
  
  // Shade Type
  shadeType?: ShadeType;
  onShadeTypeChange?: (type: ShadeType) => void;
  
  // Scene reference
  scene?: THREE.Scene | null;
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
  scene
}: TabsControlPanelProps) => {
  const [activeTab, setActiveTab] = useState('scene');

  const tabs = [
    { id: 'scene', label: 'Scene', icon: Box },
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'lighting', label: 'Environment', icon: Globe },
    { id: 'materials', label: 'Material', icon: Palette },
    { id: 'environment', label: 'View', icon: Eye },
  ];

  return (
    <TooltipProvider>
      <div className="flex h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex h-full w-full">
          <TabsList className="flex flex-col h-full w-16 bg-slate-700/50 p-1 gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value={tab.id}
                      className="w-12 h-12 p-0 text-slate-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:bg-slate-600/50"
                    >
                      <IconComponent className="h-5 w-5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{tab.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TabsList>

          <div className="flex-1 p-4 overflow-y-auto">
            <TabsContent value="scene" className="space-y-4 mt-0">
              <SceneTab
                loadedModels={loadedModels}
                currentModel={currentModel}
                isUploading={isUploading}
                uploadError={uploadError}
                onFileUpload={onFileUpload}
                scene={scene}
              />
            </TabsContent>

            <TabsContent value="properties" className="space-y-4 mt-0">
              <PropertiesTab />
            </TabsContent>

            <TabsContent value="lighting" className="space-y-4 mt-0">
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

            <TabsContent value="materials" className="space-y-4 mt-0">
              <MaterialsTab
                dimensions={dimensions}
                setDimensions={setDimensions}
                boxColor={boxColor}
                setBoxColor={setBoxColor}
                objectName={objectName}
                setObjectName={setObjectName}
              />
            </TabsContent>

            <TabsContent value="environment" className="space-y-4 mt-0">
              <ViewTab
                environment={environment}
                setEnvironment={setEnvironment}
                shadeType={shadeType}
                onShadeTypeChange={onShadeTypeChange}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default TabsControlPanel;
