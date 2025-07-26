
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
      <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl m-2">
        <TooltipProvider>
          <div className="w-full min-h-[80px]">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div 
                className={`px-6 py-1 border-r border-gray-200 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === 'home' ? 'bg-white text-black border-b-2 border-red-500 shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </div>
              <div 
                className={`px-6 py-1 border-r border-gray-200 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === 'view' ? 'bg-white text-black border-b-2 border-red-500 shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('view')}
              >
                View
              </div>
              <div 
                className={`px-6 py-1 border-r border-gray-200 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === 'tools' ? 'bg-white text-black border-b-2 border-red-500 shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </div>
              <div 
                className={`px-6 py-1 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === 'panels' ? 'bg-white text-black border-b-2 border-red-500 shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('panels')}
              >
                Panels
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white rounded-b-xl">
              {activeTab === 'home' && (
                <div className="flex gap-4 p-3 h-[52px] bg-white rounded-b-xl items-center">
                  {/* Selection Group */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === 'select' ? 'default' : 'ghost'}
                          className={`h-8 w-8 p-0 transition-all duration-200 ${
                            activeTool === 'select' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onToolSelect('select')}
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select Tool</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === 'point' ? 'default' : 'ghost'}
                          className={`h-8 w-8 p-0 transition-all duration-200 ${
                            activeTool === 'point' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onToolSelect('point')}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Point Tool - Click to add points</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === 'measure' ? 'default' : 'ghost'}
                          className={`h-8 w-8 p-0 transition-all duration-200 ${
                            activeTool === 'measure' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onToolSelect('measure')}
                        >
                          <Ruler className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Measure Tool</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-6" />

                  {/* Camera Group */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isOrthographic ? 'default' : 'ghost'}
                          className={`h-8 w-8 p-0 transition-all duration-200 ${
                            isOrthographic ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={onCameraToggle}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle {isOrthographic ? 'Perspective' : 'Orthographic'} Camera</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-6" />

                  {/* Standard Views */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                        onClick={onViewLeft}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Left View</p>
                     </TooltipContent>
                   </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                        onClick={onViewRight}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Right View</p>
                     </TooltipContent>
                   </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                        onClick={onViewFront}
                      >
                        <ArrowLeft className="h-4 w-4 rotate-90" />
                      </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Front View</p>
                     </TooltipContent>
                   </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                        onClick={onViewBack}
                      >
                        <ArrowRight className="h-4 w-4 rotate-90" />
                      </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Back View</p>
                     </TooltipContent>
                   </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                        onClick={onViewIsometric}
                      >
                        <Box className="h-4 w-4" />
                      </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Isometric View (I)</p>
                     </TooltipContent>
                   </Tooltip>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-6" />

                  {/* Zoom Controls */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomAll}
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom All (A)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 disabled:opacity-30 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomToSelected}
                          disabled={!selectedObject}
                        >
                          <Focus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Focus Selected (F)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomIn}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom In</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomOut}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom Out</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onResetView}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset View (R)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-6" />

                  {/* Utilities */}
                  <div className="flex gap-1">
                    <NotificationBell />
                  </div>
                </div>
              )}

              {activeTab === 'view' && (
                <div className="flex gap-4 p-3 h-[52px]">
                  {/* Standard Views */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onViewLeft}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Left View</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onViewRight}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Right View</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onViewIsometric}
                        >
                          <Box className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Isometric View (I)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onViewFront}
                        >
                          <ArrowLeft className="h-4 w-4 rotate-90" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Front View</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onViewBack}
                        >
                          <ArrowRight className="h-4 w-4 rotate-90" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Back View</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-6" />

                  {/* Camera Group */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isOrthographic ? 'default' : 'ghost'}
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onCameraToggle}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle {isOrthographic ? 'Perspective' : 'Orthographic'} Camera</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="flex gap-4 p-3 h-[52px]">
                  {/* Zoom Controls */}
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomAll}
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom All (A)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 disabled:opacity-30 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomToSelected}
                          disabled={!selectedObject}
                        >
                          <Focus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Focus Selected (F)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomIn}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom In</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onZoomOut}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom Out</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                          onClick={onResetView}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset View (R)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-6" />

                  {/* Utilities */}
                  <div className="flex gap-1">
                    <NotificationBell />
                  </div>
                </div>
              )}

              {activeTab === 'panels' && (
                <div className="flex gap-4 p-3 h-[52px]">
                  <div className="flex gap-1">
                    {panelButtons.map((panel) => {
                      const IconComponent = panel.icon;
                      const isActive = activePanel === panel.id && isPanelOpen;
                      
                      return (
                        <Tooltip key={panel.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive ? 'default' : 'ghost'}
                              className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-700"
                              onClick={() => handlePanelClick(panel.id)}
                            >
                              <IconComponent className="h-4 w-4" />
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
