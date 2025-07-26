import React, { useState, useRef } from 'react';
import { MapPin, Ruler, Target, Camera, ArrowLeft, ArrowRight, Box, ZoomIn, ZoomOut, Maximize, Focus, RotateCcw, Settings, Eye, HelpCircle, Lightbulb, Cog, Grid3X3, EyeOff, Layers, ChevronUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import NotificationBell from '@/components/NotificationBell/NotificationBell';
import ExpandableShadeSelector, { type ShadeType } from '@/components/ExpandableShadeSelector/ExpandableShadeSelector';
import { useFileHandlers } from '@/hooks/useFileHandlers';

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
  // Shade type props
  shadeType?: ShadeType;
  onShadeTypeChange?: (type: ShadeType) => void;
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
  isPanelOpen = false,
  shadeType = 'shaded',
  onShadeTypeChange
}: AidToolsBarProps) => {
  const [activeTab, setActiveTab] = useState<'home' | 'view' | 'tools' | 'panels' | 'admin'>('home');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUpload } = useFileHandlers();

  const handlePanelClick = (panelId: string) => {
    if (onPanelChange) {
      onPanelChange(panelId);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      // Reset the input value to allow re-selecting the same file
      event.target.value = '';
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
          <div className="w-full min-h-[120px]">
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
                className={`px-6 py-1 border-r border-gray-200 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === 'panels' ? 'bg-white text-black border-b-2 border-red-500 shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('panels')}
              >
                Panels
              </div>
              <div 
                className={`px-6 py-1 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === 'admin' ? 'bg-white text-black border-b-2 border-red-500 shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                Admin
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white rounded-b-xl">
              {activeTab === 'home' && (
                <div className="flex gap-6 p-3 h-[80px] bg-white rounded-b-xl items-start">
                  {/* Selection Group */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Selection</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant={activeTool === 'select' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            activeTool === 'select' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onToolSelect('select')}
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Select</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant={activeTool === 'point' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            activeTool === 'point' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onToolSelect('point')}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Point</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant={activeTool === 'measure' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            activeTool === 'measure' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onToolSelect('measure')}
                        >
                          <Ruler className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Measure</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Display Group */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Display</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 flex items-center justify-center">
                          {onShadeTypeChange && (
                            <ExpandableShadeSelector
                              currentShadeType={shadeType}
                              onShadeTypeChange={onShadeTypeChange}
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-600 mt-1">Shade</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant={isOrthographic ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            isOrthographic ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={onCameraToggle}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">{isOrthographic ? 'Ortho' : 'Persp'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Standard Views */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Views</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                          onClick={onViewLeft}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Left</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                          onClick={onViewRight}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Right</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                          onClick={onViewIsometric}
                        >
                          <Box className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">ISO</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Zoom Controls */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Zoom</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomAll}
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">All</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 disabled:opacity-30 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomToSelected}
                          disabled={!selectedObject}
                        >
                          <Focus className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Focus</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomIn}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">In</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomOut}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Out</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onResetView}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Reset</span>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs text-gray-600 font-medium">{Math.round(zoomLevel)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Utilities */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Utilities</div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 flex items-center justify-center">
                        <NotificationBell />
                      </div>
                      <span className="text-xs text-gray-600 mt-1">Alerts</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'view' && (
                <div className="flex gap-4 p-3 h-[80px] items-start">
                  {/* Shade Types */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Shade Types</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant={shadeType === 'shaded' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            shadeType === 'shaded' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onShadeTypeChange?.('shaded')}
                        >
                          <Box className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Shaded</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant={shadeType === 'wireframe' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            shadeType === 'wireframe' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onShadeTypeChange?.('wireframe')}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Wire</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant={shadeType === 'hidden' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            shadeType === 'hidden' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onShadeTypeChange?.('hidden')}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Hidden</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant={shadeType === 'shaded-with-edges' ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            shadeType === 'shaded-with-edges' ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => onShadeTypeChange?.('shaded-with-edges')}
                        >
                          <Layers className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Edges</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Camera Controls */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Camera</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant={isOrthographic ? 'default' : 'ghost'}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            isOrthographic ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={onCameraToggle}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">{isOrthographic ? 'Ortho' : 'Persp'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Standard Views */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Standard Views</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onViewLeft}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Left</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onViewRight}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Right</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onViewIsometric}
                        >
                          <Box className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">ISO</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onViewFront}
                        >
                          <ArrowLeft className="h-4 w-4 rotate-90" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Front</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onViewBack}
                        >
                          <ArrowRight className="h-4 w-4 rotate-90" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Back</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="flex gap-4 p-3 h-[80px] items-start">
                  {/* Zoom Controls */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Zoom Tools</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomAll}
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">All</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 disabled:opacity-30 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomToSelected}
                          disabled={!selectedObject}
                        >
                          <Focus className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Focus</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomIn}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">In</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onZoomOut}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Out</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 hover:bg-gray-100 text-gray-700"
                          onClick={onResetView}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Reset</span>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs text-gray-600 font-medium">{Math.round(zoomLevel)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-gray-300 h-12 mt-6" />

                  {/* Utilities */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Utilities</div>
                    <div className="flex flex-col items-center">
                      <NotificationBell />
                      <span className="text-xs text-gray-600 mt-1">Alerts</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'panels' && (
                <div className="flex gap-4 p-3 h-[80px] items-start">
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Control Panels</div>
                    <div className="flex gap-2">
                      {panelButtons.map((panel) => {
                        const IconComponent = panel.icon;
                        const isActive = activePanel === panel.id && isPanelOpen;
                        
                        return (
                          <div key={panel.id} className="flex flex-col items-center">
                            <Button
                              variant={isActive ? 'default' : 'ghost'}
                              className={`p-2 h-8 w-8 transition-all duration-200 ${
                                isActive ? 'bg-red-50 text-black border border-red-200 shadow-sm' : 'hover:bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => handlePanelClick(panel.id)}
                            >
                              <IconComponent className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-gray-600 mt-1">
                              {panel.id === 'scene' ? 'Scene' : 
                               panel.id === 'properties' ? 'Props' : 
                               panel.id === 'lighting' ? 'Light' : 
                               panel.id === 'settings' ? 'Config' : 'Help'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <div className="flex gap-4 p-3 h-[80px] items-start">
                  {/* File Management */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2 font-medium">File Management</div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="p-2 h-8 w-8 transition-all duration-200 hover:bg-gray-100 text-gray-700"
                          onClick={handleImportClick}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 mt-1">Import</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      </div>
      {/* Hidden file input for import functionality */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".fbx,.obj,.gltf,.glb,application/octet-stream,model/gltf+json,model/gltf-binary"
        onChange={handleFileChange}
        multiple={false}
      />
    </div>
  );
};

export default AidToolsBar;
