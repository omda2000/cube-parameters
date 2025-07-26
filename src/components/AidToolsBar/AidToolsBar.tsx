
import React from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, Settings, Lightbulb, Cog, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
  // Sidebar/Panel props
  activeTab?: string;
  onTabChange?: (tab: string) => void;
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
  activeTab = '',
  onTabChange,
  isPanelOpen = false
}: AidToolsBarProps) => {
  const [activeRibbonTab, setActiveRibbonTab] = React.useState('home');

  const sidebarTabs = [
    { id: 'scene', label: 'Scene Objects', icon: Box, description: 'Manage 3D objects and hierarchy' },
    { id: 'properties', label: 'Object Properties', icon: Settings, description: 'Edit object properties and materials' },
    { id: 'lighting', label: 'Lighting & Environment', icon: Lightbulb, description: 'Control lighting and environment settings' },
    { id: 'settings', label: 'Settings', icon: Cog, description: 'App settings and units configuration' },
    { id: 'help', label: 'User Guide', icon: HelpCircle, description: 'Touch and desktop controls guide' },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <TooltipProvider>
          {/* Ribbon-style interface using custom components */}
          <div className="w-full min-h-[120px]">
            {/* Tab Headers */}
            <div className="flex border-b bg-muted/30">
              <div 
                className={`px-4 py-2 border-r text-sm font-medium cursor-pointer ${
                  activeRibbonTab === 'home' ? 'bg-background' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveRibbonTab('home')}
              >
                Home
              </div>
              <div 
                className={`px-4 py-2 border-r text-sm font-medium cursor-pointer ${
                  activeRibbonTab === 'view' ? 'bg-background' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveRibbonTab('view')}
              >
                View
              </div>
              <div 
                className={`px-4 py-2 border-r text-sm font-medium cursor-pointer ${
                  activeRibbonTab === 'panels' ? 'bg-background' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveRibbonTab('panels')}
              >
                Panels
              </div>
              <div 
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeRibbonTab === 'tools' ? 'bg-background' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveRibbonTab('tools')}
              >
                Tools
              </div>
            </div>
            
            {/* Tab Content */}
            {activeRibbonTab === 'home' && (
              <div className="flex gap-6 p-4">
                {/* Selection Group */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Selection</div>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === 'select' ? 'default' : 'outline'}
                          className="flex flex-col items-center p-2 h-16 min-w-[60px]"
                          onClick={() => onToolSelect('select')}
                        >
                          <Target className="h-6 w-6 mb-1" />
                          <span className="text-xs">Select</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select Tool</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === 'point' ? 'default' : 'outline'}
                          className="flex flex-col items-center p-2 h-16 min-w-[60px]"
                          onClick={() => onToolSelect('point')}
                        >
                          <MapPin className="h-6 w-6 mb-1" />
                          <span className="text-xs">Point</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Point Tool - Click to add points</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-px bg-border" />

                {/* Measure Group */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Measure</div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTool === 'measure' ? 'default' : 'outline'}
                        className="flex flex-col items-center p-2 h-16 min-w-[60px]"
                        onClick={() => onToolSelect('measure')}
                      >
                        <Ruler className="h-6 w-6 mb-1" />
                        <span className="text-xs">Measure</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Measure Tool</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}

            {activeRibbonTab === 'view' && (
              <div className="flex gap-6 p-4">
                {/* Camera Group */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Camera</div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isOrthographic ? 'default' : 'outline'}
                        className="flex flex-col items-center p-2 h-16 min-w-[60px]"
                        onClick={onCameraToggle}
                      >
                        <Camera className="h-6 w-6 mb-1" />
                        <span className="text-xs">{isOrthographic ? 'Ortho' : 'Persp'}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle {isOrthographic ? 'Perspective' : 'Orthographic'} Camera</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Separator */}
                <div className="w-px bg-border" />

                {/* Standard Views */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Standard Views</div>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center p-1 h-12 min-w-[40px]"
                          onClick={onViewLeft}
                        >
                          <ArrowLeft className="h-4 w-4 mb-1" />
                          <span className="text-xs">Left</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Left View</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center p-1 h-12 min-w-[40px]"
                          onClick={onViewRight}
                        >
                          <ArrowRight className="h-4 w-4 mb-1" />
                          <span className="text-xs">Right</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Right View</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center p-1 h-12 min-w-[40px]"
                          onClick={onViewIsometric}
                        >
                          <Box className="h-4 w-4 mb-1" />
                          <span className="text-xs">Iso</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Isometric View (I)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-px bg-border" />

                {/* Zoom Controls */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Zoom</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center p-1 h-12 min-w-[40px]"
                            onClick={onZoomAll}
                          >
                            <Maximize className="h-4 w-4 mb-1" />
                            <span className="text-xs">Fit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom All (A)</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] disabled:opacity-30"
                            onClick={onZoomToSelected}
                            disabled={!selectedObject}
                          >
                            <Focus className="h-4 w-4 mb-1" />
                            <span className="text-xs">Focus</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Focus Selected (F)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex gap-1 items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={onZoomIn}
                          >
                            <ZoomIn className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom In</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-xs text-muted-foreground px-1 min-w-[2.5rem] text-center">
                        {Math.round(zoomLevel)}%
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={onZoomOut}
                          >
                            <ZoomOut className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom Out</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={onResetView}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset View (R)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRibbonTab === 'panels' && (
              <div className="flex gap-6 p-4">
                {/* Panel Controls */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Panel Controls</div>
                  <div className="flex gap-2">
                    {sidebarTabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = activeTab === tab.id && isPanelOpen;
                      
                      return (
                        <Tooltip key={tab.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive ? 'default' : 'outline'}
                              className="flex flex-col items-center p-2 h-16 min-w-[60px]"
                              onClick={() => handleTabClick(tab.id)}
                            >
                              <IconComponent className="h-6 w-6 mb-1" />
                              <span className="text-xs">{tab.label.split(' ')[0]}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-48">
                            <div className="text-xs">
                              <p className="font-medium">{tab.label}</p>
                              <p className="text-muted-foreground mt-1">{tab.description}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeRibbonTab === 'tools' && (
              <div className="flex gap-6 p-4">
                {/* Utilities */}
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-2 text-center">Utilities</div>
                  <div className="flex items-center justify-center h-16">
                    <NotificationBell />
                  </div>
                </div>
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AidToolsBar;
