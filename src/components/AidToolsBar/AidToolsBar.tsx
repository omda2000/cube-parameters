import React from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, Settings, Eye, HelpCircle, Lightbulb, Cog } from 'lucide-react';
import { Ribbon, RibbonGroup, RibbonGroupItem, RibbonButton } from "react-bootstrap-ribbon";
import "react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css";
import NotificationBell from '@/components/NotificationBell/NotificationBell';

interface AidToolsBarProps {
  onToolSelect: (tool: 'select' | 'point' | 'measure') => void;
  activeTool: 'select' | 'point' | 'measure';
  onViewFront?: () => void;
  onViewBack?: () => void;
  onViewLeft?: () => void;
  onViewRight?: () => void;
  onViewIsometric?: () => void;
  onToggle3DRotate?: () => void;
  isOrthographic?: boolean;
  onCameraToggle?: () => void;
  onZoomAll?: () => void;
  onZoomToSelected?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  selectedObject?: any;
  zoomLevel?: number;
  // Panel management props
  activePanel?: string;
  onPanelChange?: (panel: string) => void;
  isPanelOpen?: boolean;
}

const AidToolsBar = ({
  onToolSelect,
  activeTool,
  onViewFront,
  onViewBack,
  onViewLeft,
  onViewRight,
  onViewIsometric,
  onToggle3DRotate,
  isOrthographic = false,
  onCameraToggle,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedObject,
  zoomLevel = 100,
  activePanel,
  onPanelChange,
  isPanelOpen = false
}: AidToolsBarProps) => {
  const handlePanelClick = (panelId: string) => {
    if (onPanelChange) {
      onPanelChange(panelId);
    }
  };

  const panelButtons = [
    { id: 'scene', label: 'Scene Objects', icon: Box, description: 'Manage 3D objects and hierarchy' },
    { id: 'properties', label: 'Object Properties', icon: Settings, description: 'Edit object properties and materials' },
    { id: 'lighting', label: 'Lighting & Environment', icon: Lightbulb, description: 'Control lighting and environment settings' },
    { id: 'settings', label: 'Settings', icon: Cog, description: 'App settings and units configuration' },
    { id: 'help', label: 'User Guide', icon: HelpCircle, description: 'Touch and desktop controls guide' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2">
      <Ribbon breakpoint="lg" height="6rem">
        <RibbonGroup title="Selection" colClass="col-2">
          <RibbonGroupItem colClass="col-4" onClick={() => onToolSelect('select')}>
            <RibbonButton>
              <Target className={`h-5 w-5 ${activeTool === 'select' ? 'text-red-600' : 'text-gray-700'}`} />
              <div>Select</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-4" onClick={() => onToolSelect('point')}>
            <RibbonButton>
              <MapPin className={`h-5 w-5 ${activeTool === 'point' ? 'text-red-600' : 'text-gray-700'}`} />
              <div>Point</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-4" onClick={() => onToolSelect('measure')}>
            <RibbonButton>
              <Ruler className={`h-5 w-5 ${activeTool === 'measure' ? 'text-red-600' : 'text-gray-700'}`} />
              <div>Measure</div>
            </RibbonButton>
          </RibbonGroupItem>
        </RibbonGroup>

        <RibbonGroup title="Camera" colClass="col-1">
          <RibbonGroupItem colClass="col-12" onClick={onCameraToggle}>
            <RibbonButton>
              <Camera className={`h-5 w-5 ${isOrthographic ? 'text-red-600' : 'text-gray-700'}`} />
              <div>{isOrthographic ? 'Ortho' : 'Persp'}</div>
            </RibbonButton>
          </RibbonGroupItem>
        </RibbonGroup>

        <RibbonGroup title="Views" colClass="col-3">
          <RibbonGroupItem colClass="col-3" onClick={onViewLeft}>
            <RibbonButton>
              <ArrowLeft className="h-5 w-5 text-gray-700" />
              <div>Left</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-3" onClick={onViewRight}>
            <RibbonButton>
              <ArrowRight className="h-5 w-5 text-gray-700" />
              <div>Right</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-3" onClick={onViewFront}>
            <RibbonButton>
              <ArrowLeft className="h-5 w-5 text-gray-700 rotate-90" />
              <div>Front</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-3" onClick={onViewBack}>
            <RibbonButton>
              <ArrowRight className="h-5 w-5 text-gray-700 rotate-90" />
              <div>Back</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-6" onClick={onViewIsometric}>
            <RibbonButton>
              <Box className="h-5 w-5 text-gray-700" />
              <div>Isometric</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-6">
            <RibbonButton>
              <div className="text-sm font-medium">{Math.round(zoomLevel)}%</div>
            </RibbonButton>
          </RibbonGroupItem>
        </RibbonGroup>

        <RibbonGroup title="Zoom" colClass="col-3">
          <RibbonGroupItem colClass="col-4" onClick={onZoomAll}>
            <RibbonButton>
              <Maximize className="h-5 w-5 text-gray-700" />
              <div>Fit All</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-4" onClick={onZoomToSelected}>
            <RibbonButton>
              <Focus className={`h-5 w-5 ${!selectedObject ? 'text-gray-400' : 'text-gray-700'}`} />
              <div>Focus</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-4" onClick={onZoomIn}>
            <RibbonButton>
              <ZoomIn className="h-5 w-5 text-gray-700" />
              <div>Zoom In</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-6" onClick={onZoomOut}>
            <RibbonButton>
              <ZoomOut className="h-5 w-5 text-gray-700" />
              <div>Zoom Out</div>
            </RibbonButton>
          </RibbonGroupItem>
          <RibbonGroupItem colClass="col-6" onClick={onResetView}>
            <RibbonButton>
              <RotateCcw className="h-5 w-5 text-gray-700" />
              <div>Reset</div>
            </RibbonButton>
          </RibbonGroupItem>
        </RibbonGroup>

        <RibbonGroup title="Panels" colClass="col-3">
          {panelButtons.map((panel) => {
            const IconComponent = panel.icon;
            return (
              <RibbonGroupItem 
                key={panel.id} 
                colClass="col-6" 
                onClick={() => handlePanelClick(panel.id)}
              >
                <RibbonButton>
                  <IconComponent className={`h-5 w-5 ${activePanel === panel.id ? 'text-red-600' : 'text-gray-700'}`} />
                  <div>{panel.label}</div>
                </RibbonButton>
              </RibbonGroupItem>
            );
          })}
          <RibbonGroupItem colClass="col-6">
            <RibbonButton>
              <NotificationBell />
              <div>Alerts</div>
            </RibbonButton>
          </RibbonGroupItem>
        </RibbonGroup>
      </Ribbon>
    </div>
  );
};

export default AidToolsBar;
