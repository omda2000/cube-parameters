
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SceneTab from '../TabsControlPanel/tabs/SceneTab';
import PropertiesTab from '../TabsControlPanel/tabs/PropertiesTab';
import LightingTab from '../TabsControlPanel/tabs/LightingTab';
import HelpPanel from '../HelpPanel/HelpPanel';
import NotificationsPanel from '../NotificationsPanel/NotificationsPanel';

interface OrganizedControlPanelProps {
  activeTab: string;
  isOpen: boolean;
  onClose: () => void;
  controlsPanelProps: any;
}

const OrganizedControlPanel = ({
  activeTab,
  isOpen,
  onClose,
  controlsPanelProps
}: OrganizedControlPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'scene': return 'Scene Objects';
      case 'properties': return 'Object Properties';
      case 'lighting': return 'Lighting & Environment';
      case 'environment': return 'View Settings';
      case 'help': return 'User Guide';
      case 'notifications': return 'Notifications';
      default: return 'Control Panel';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scene':
        return (
          <SceneTab
            loadedModels={controlsPanelProps.loadedModels}
            currentModel={controlsPanelProps.currentModel}
            isUploading={controlsPanelProps.isUploading}
            uploadError={controlsPanelProps.uploadError}
            onFileUpload={controlsPanelProps.onFileUpload}
            scene={controlsPanelProps.scene}
          />
        );
      case 'properties':
        return <PropertiesTab />;
      case 'lighting':
        return (
          <LightingTab
            sunlight={controlsPanelProps.sunlight}
            setSunlight={controlsPanelProps.setSunlight}
            ambientLight={controlsPanelProps.ambientLight}
            setAmbientLight={controlsPanelProps.setAmbientLight}
            shadowQuality={controlsPanelProps.shadowQuality}
            setShadowQuality={controlsPanelProps.setShadowQuality}
            environment={controlsPanelProps.environment}
            setEnvironment={controlsPanelProps.setEnvironment}
          />
        );
      case 'environment':
        return <div className="p-4 text-center text-muted-foreground">Environment settings have been moved to other panels</div>;
      case 'help':
        return <HelpPanel />;
      case 'notifications':
        return <NotificationsPanel />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed left-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-2xl z-40"
      style={{
        top: 'calc(120px + 1rem)', // Ribbon height + margin
        width: 340,
        height: 520,
        maxHeight: '85vh'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          {getTabTitle(activeTab)}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrganizedControlPanel;
