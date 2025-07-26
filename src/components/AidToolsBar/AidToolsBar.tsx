import React, { useState } from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, Settings, Eye, HelpCircle, Lightbulb, Cog } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'home' | 'view' | 'tools' | 'panels'>('home');

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
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white border-b shadow-sm">
        <TooltipProvider>
          <div className="w-full min-h-[120px]">
            {/* Tab Headers */}
            <div className="flex border-b bg-gray-50">
              <div 
                className={`px-4 py-2 border-r text-sm font-medium cursor-pointer transition-colors ${
                  activeTab === 'home' ? 'bg-white text-gray-900 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </div>
              <div 
                className={`px-4 py-2 border-r text-sm font-medium cursor-pointer transition-colors ${
                  activeTab === 'view' ? 'bg-white text-gray-900 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('view')}
              >
                View
              </div>
              <div 
                className={`px-4 py-2 border-r text-sm font-medium cursor-pointer transition-colors ${
                  activeTab === 'tools' ? 'bg-white text-gray-900 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </div>
              <div 
                className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                  activeTab === 'panels' ? 'bg-white text-gray-900 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('panels')}
              >
                Panels
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white">
              {activeTab === 'home' && (
                <div className="flex gap-6 p-4">
                  {/* Selection Group */}
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={activeTool === 'select' ? 'default' : 'outline'}
                            className="flex flex-col items-center p-2 h-16 min-w-[60px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                            className="flex flex-col items-center p-2 h-16 min-w-[60px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Selection</div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300" />

                  {/* Measure Group */}
                  <div className="flex flex-col">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === 'measure' ? 'default' : 'outline'}
                          className="flex flex-col items-center p-2 h-16 min-w-[60px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Measure</div>
                  </div>

                  {/* Camera Group */}
                  <div className="w-px bg-gray-300" />

                  {/* Camera Group */}
                  <div className="flex flex-col">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isOrthographic ? 'default' : 'outline'}
                          className="flex flex-col items-center p-2 h-16 min-w-[60px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Camera</div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300" />

                  {/* Standard Views */}
                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Standard Views</div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300" />

                  {/* Zoom Controls */}
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                              className="flex flex-col items-center p-1 h-12 min-w-[40px] disabled:opacity-30 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                              className="h-6 w-6 p-0 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                              onClick={onZoomIn}
                            >
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Zoom In</p>
                          </TooltipContent>
                        </Tooltip>

                        <div className="text-xs text-gray-600 px-1 min-w-[2.5rem] text-center">
                          {Math.round(zoomLevel)}%
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                              className="h-6 w-6 p-0 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Zoom</div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300" />

                  {/* Utilities */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center h-16">
                      <NotificationBell />
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">Utilities</div>
                  </div>
                </div>
              )}

              {activeTab === 'view' && (
                <div className="flex gap-6 p-4">
                  {/* Standard Views */}
                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            onClick={onViewFront}
                          >
                            <ArrowLeft className="h-4 w-4 mb-1 rotate-90" />
                            <span className="text-xs">Front</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Front View</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            onClick={onViewBack}
                          >
                            <ArrowRight className="h-4 w-4 mb-1 rotate-90" />
                            <span className="text-xs">Back</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Back View</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">Standard Views</div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300" />

                  {/* Camera Group */}
                  <div className="flex flex-col">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isOrthographic ? 'default' : 'outline'}
                          className="flex flex-col items-center p-2 h-16 min-w-[60px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Camera</div>
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="flex gap-6 p-4">
                  {/* Zoom Controls */}
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex flex-col items-center p-1 h-12 min-w-[40px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                              className="flex flex-col items-center p-1 h-12 min-w-[40px] disabled:opacity-30 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                              className="h-6 w-6 p-0 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                              onClick={onZoomIn}
                            >
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Zoom In</p>
                          </TooltipContent>
                        </Tooltip>

                        <div className="text-xs text-gray-600 px-1 min-w-[2.5rem] text-center">
                          {Math.round(zoomLevel)}%
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                              className="h-6 w-6 p-0 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
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
                    <div className="text-xs text-gray-600 mt-2 text-center">Zoom</div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300" />

                  {/* Utilities */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center h-16">
                      <NotificationBell />
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">Utilities</div>
                  </div>
                </div>
              )}

              {activeTab === 'panels' && (
                <div className="flex gap-6 p-4">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      {panelButtons.map((panel) => {
                        const IconComponent = panel.icon;
                        const isActive = activePanel === panel.id && isPanelOpen;
                        
                        return (
                          <Tooltip key={panel.id}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={isActive ? 'default' : 'outline'}
                                className="flex flex-col items-center p-2 h-16 min-w-[60px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                                onClick={() => handlePanelClick(panel.id)}
                              >
                                <IconComponent className="h-6 w-6 mb-1" />
                                <span className="text-xs">{panel.label.split(' ')[0]}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-48">
                              <div className="text-xs">
                                <p className="font-medium">{panel.label}</p>
                                <p className="text-muted-foreground mt-1">{panel.description}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">Control Panels</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AidToolsBar;
