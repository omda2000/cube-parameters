
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Sun, Palette, Eye, Settings } from 'lucide-react';
import FileUploadDialog from '../FileUpload/FileUploadDialog';
import UnifiedSceneTree from '../UnifiedSceneTree/UnifiedSceneTree';
import PropertyPanel from '../PropertyPanel/PropertyPanel';
import LightingControls from '../LightingControls';
import MaterialControls from '../MaterialControls';
import ViewControls from '../ViewControls';
import { useSelection } from '../../hooks/useSelection';
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
}

const TabsControlPanel = ({
  loadedModels,
  currentModel,
  isUploading,
  uploadError,
  onFileUpload,
  onModelSelect,
  onModelRemove,
  onPrimitiveSelect,
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
  setEnvironment
}: TabsControlPanelProps) => {
  const [activeTab, setActiveTab] = useState('scene');
  const { selectedObject, selectObject } = useSelection();

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject) {
      // Handle property updates
      console.log(`Property changed: ${property} = ${value}`);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-700/50 h-12">
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
            <Settings className="h-3 w-3" />
            <span>Props</span>
          </TabsTrigger>
          <TabsTrigger 
            value="lighting" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Sun className="h-3 w-3" />
            <span>Light</span>
          </TabsTrigger>
          <TabsTrigger 
            value="materials" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Palette className="h-3 w-3" />
            <span>Material</span>
          </TabsTrigger>
          <TabsTrigger 
            value="environment" 
            className="text-xs text-slate-300 data-[state=active]:bg-indigo-600 flex flex-col items-center gap-1 p-2"
          >
            <Eye className="h-3 w-3" />
            <span>View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scene" className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <FileUploadDialog 
              onFileSelect={onFileUpload} 
              isLoading={isUploading}
            />
          </div>

          {uploadError && (
            <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-200 text-sm">
              {uploadError}
            </div>
          )}

          <UnifiedSceneTree
            loadedModels={loadedModels}
            currentModel={currentModel}
            showPrimitives={!currentModel}
            selectedObject={selectedObject}
            onObjectSelect={selectObject}
            scene={null}
          />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4 mt-4">
          <PropertyPanel
            selectedObject={selectedObject}
            onPropertyChange={handlePropertyChange}
          />
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4 mt-4">
          <LightingControls 
            sunlight={sunlight}
            setSunlight={setSunlight}
            ambientLight={ambientLight}
            setAmbientLight={setAmbientLight}
            shadowQuality={shadowQuality}
            setShadowQuality={setShadowQuality}
          />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4 mt-4">
          <MaterialControls 
            dimensions={dimensions}
            setDimensions={setDimensions}
            boxColor={boxColor}
            setBoxColor={setBoxColor}
            objectName={objectName}
            setObjectName={setObjectName}
          />
        </TabsContent>

        <TabsContent value="environment" className="space-y-4 mt-4">
          <ViewControls 
            environment={environment}
            setEnvironment={setEnvironment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsControlPanel;
