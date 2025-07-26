import React from 'react';
import { 
  RibbonComponent, 
  RibbonTabsDirective, 
  RibbonTabDirective, 
  RibbonGroupsDirective, 
  RibbonGroupDirective, 
  RibbonCollectionsDirective, 
  RibbonCollectionDirective, 
  RibbonItemsDirective, 
  RibbonItemDirective,
  DisplayMode
} from '@syncfusion/ej2-react-ribbon';
import { registerLicense } from '@syncfusion/ej2-base';
import { 
  Target, 
  MapPin, 
  Ruler, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Focus, 
  RotateCcw,
  Camera,
  ArrowLeft,
  ArrowRight,
  Box,
  Settings,
  Lightbulb,
  HelpCircle,
  Cog,
  Layers
} from 'lucide-react';
import NotificationBell from '../NotificationBell/NotificationBell';

// Register Syncfusion license (use your license key here or remove for trial)
// registerLicense('YOUR_LICENSE_KEY');

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

  // Custom icon wrapper to render Lucide icons
  const IconWrapper = ({ IconComponent, size = 16 }: { IconComponent: any, size?: number }) => {
    return <IconComponent size={size} />;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <RibbonComponent>
        <RibbonTabsDirective>
          {/* Home Tab */}
          <RibbonTabDirective header="Home">
            <RibbonGroupsDirective>
              {/* Selection Group */}
              <RibbonGroupDirective header="Selection">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Select',
                          iconCss: 'e-select-icon',
                          isToggle: true,
                          clicked: () => onToolSelect('select')
                        }}
                         displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Point',
                          iconCss: 'e-point-icon',
                          isToggle: true,
                          clicked: () => onToolSelect('point')
                        }}
                         displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>

              {/* Measure Group */}
              <RibbonGroupDirective header="Measure">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Measure',
                          iconCss: 'e-measure-icon',
                          isToggle: true,
                          clicked: () => onToolSelect('measure')
                        }}
                         displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>

              {/* Camera Group */}
              <RibbonGroupDirective header="Camera">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: isOrthographic ? 'Ortho' : 'Persp',
                          iconCss: 'e-camera-icon',
                          isToggle: true,
                          clicked: onCameraToggle
                        }}
                         displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>

              {/* Standard Views Group */}
              <RibbonGroupDirective header="Standard Views">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Left',
                          iconCss: 'e-left-icon',
                          clicked: onViewLeft
                        }}
                         displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Right',
                          iconCss: 'e-right-icon',
                          clicked: onViewRight
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Iso',
                          iconCss: 'e-iso-icon',
                          clicked: onViewIsometric
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>

              {/* Zoom Group */}
              <RibbonGroupDirective header="Zoom">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Fit All',
                          iconCss: 'e-fit-icon',
                          clicked: onZoomAll
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Focus',
                          iconCss: 'e-focus-icon',
                          clicked: onZoomToSelected
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Zoom In',
                          iconCss: 'e-zoom-in-icon',
                          clicked: onZoomIn
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Zoom Out',
                          iconCss: 'e-zoom-out-icon',
                          clicked: onZoomOut
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Reset',
                          iconCss: 'e-reset-icon',
                          clicked: onResetView
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>

              {/* Utilities Group */}
              <RibbonGroupDirective header="Utilities">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Template" 
                        itemTemplate={() => (
                          <div className="flex items-center justify-center p-2">
                            <NotificationBell />
                          </div>
                        )}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>
            </RibbonGroupsDirective>
          </RibbonTabDirective>

          {/* View Tab */}
          <RibbonTabDirective header="View">
            <RibbonGroupsDirective>
              {/* Standard Views Group */}
              <RibbonGroupDirective header="Standard Views">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Left',
                          iconCss: 'e-left-icon',
                          clicked: onViewLeft
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Right',
                          iconCss: 'e-right-icon',
                          clicked: onViewRight
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Isometric',
                          iconCss: 'e-iso-icon',
                          clicked: onViewIsometric
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Front',
                          iconCss: 'e-front-icon',
                          clicked: onViewFront
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Back',
                          iconCss: 'e-back-icon',
                          clicked: onViewBack
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>

              {/* Camera Controls */}
              <RibbonGroupDirective header="Camera">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: isOrthographic ? 'Orthographic' : 'Perspective',
                          iconCss: 'e-camera-icon',
                          isToggle: true,
                          clicked: onCameraToggle
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>
            </RibbonGroupsDirective>
          </RibbonTabDirective>

          {/* Tools Tab */}
          <RibbonTabDirective header="Tools">
            <RibbonGroupsDirective>
              {/* Zoom Controls */}
              <RibbonGroupDirective header="Zoom Controls">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Fit All',
                          iconCss: 'e-fit-icon',
                          clicked: onZoomAll
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Focus Selected',
                          iconCss: 'e-focus-icon',
                          clicked: onZoomToSelected
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Zoom In',
                          iconCss: 'e-zoom-in-icon',
                          clicked: onZoomIn
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Zoom Out',
                          iconCss: 'e-zoom-out-icon',
                          clicked: onZoomOut
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Reset View',
                          iconCss: 'e-reset-icon',
                          clicked: onResetView
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>
            </RibbonGroupsDirective>
          </RibbonTabDirective>

          {/* Panels Tab */}
          <RibbonTabDirective header="Panels">
            <RibbonGroupsDirective>
              {/* Panel Controls */}
              <RibbonGroupDirective header="Panel Controls">
                <RibbonCollectionsDirective>
                  <RibbonCollectionDirective>
                    <RibbonItemsDirective>
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Scene Objects',
                          iconCss: 'e-scene-icon',
                          isToggle: true,
                          clicked: () => handlePanelClick('scene')
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Properties',
                          iconCss: 'e-properties-icon',
                          isToggle: true,
                          clicked: () => handlePanelClick('properties')
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Lighting',
                          iconCss: 'e-lighting-icon',
                          isToggle: true,
                          clicked: () => handlePanelClick('lighting')
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Settings',
                          iconCss: 'e-settings-icon',
                          isToggle: true,
                          clicked: () => handlePanelClick('settings')
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                      <RibbonItemDirective 
                        type="Button" 
                        buttonSettings={{
                          content: 'Help',
                          iconCss: 'e-help-icon',
                          isToggle: true,
                          clicked: () => handlePanelClick('help')
                        }}
                        displayOptions={DisplayMode.Classic}
                      />
                    </RibbonItemsDirective>
                  </RibbonCollectionDirective>
                </RibbonCollectionsDirective>
              </RibbonGroupDirective>
            </RibbonGroupsDirective>
          </RibbonTabDirective>
        </RibbonTabsDirective>
      </RibbonComponent>
    </div>
  );
};

export default AidToolsBar;