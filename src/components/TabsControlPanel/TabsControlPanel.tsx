
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SceneTab from './tabs/SceneTab';
import PropertiesTab from './tabs/PropertiesTab';
import MaterialsTab from './tabs/MaterialsTab';
import LightingTab from './tabs/LightingTab';
import ViewTab from './tabs/ViewTab';
import SettingsTab from './tabs/SettingsTab';
import NavigationPanel from '../NavigationPanel/NavigationPanel';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  BoxDimensions, 
  ShadowQuality 
} from '../../types/model';

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
  scene?: THREE.Scene;
  isOrthographic: boolean;
  onCameraToggle: () => void;
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
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
  setEnvironment,
  activeTab,
  scene,
  isOrthographic,
  onCameraToggle,
  camera,
  controls
}: TabsControlPanelProps) => {
  // Removed duplicate material logic - now handled by useDefaultMaterials hook

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs value={activeTab} className="w-full h-full flex flex-col">
        {/* Hide tab list - navigation handled by left panel icons */}
        <TabsList className="hidden">
          <TabsTrigger value="scene">Scene</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="lighting">Lighting</TabsTrigger>
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="scene" className="h-full overflow-y-auto mt-0">
            <SceneTab 
              loadedModels={loadedModels}
              currentModel={currentModel}
              isUploading={isUploading}
              uploadError={uploadError}
              onFileUpload={onFileUpload}
              onModelSelect={onModelSelect}
              onModelRemove={onModelRemove}
              onPrimitiveSelect={onPrimitiveSelect}
              scene={scene}
            />
          </TabsContent>

          <TabsContent value="properties" className="h-full overflow-y-auto mt-0">
            <PropertiesTab 
              dimensions={dimensions}
              setDimensions={setDimensions}
              boxColor={boxColor}
              setBoxColor={setBoxColor}
              objectName={objectName}
              setObjectName={setObjectName}
            />
          </TabsContent>

          <TabsContent value="materials" className="h-full overflow-y-auto mt-0">
            <MaterialsTab 
              dimensions={dimensions}
              setDimensions={setDimensions}
              boxColor={boxColor}
              setBoxColor={setBoxColor}
              objectName={objectName}
              setObjectName={setObjectName}
            />
          </TabsContent>

          <TabsContent value="lighting" className="h-full overflow-y-auto mt-0">
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

          <TabsContent value="view" className="h-full overflow-y-auto space-y-4 mt-0">
            <NavigationPanel camera={camera} controls={controls} />
            <ViewTab 
              environment={environment}
              setEnvironment={setEnvironment}
              isOrthographic={isOrthographic}
              onCameraToggle={onCameraToggle}
            />
          </TabsContent>

          <TabsContent value="settings" className="h-full overflow-y-auto mt-0">
            <SettingsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TabsControlPanel;
