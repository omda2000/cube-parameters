import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mouse, 
  Smartphone, 
  Hand, 
  RotateCcw, 
  ZoomIn, 
  Move, 
  Target,
  Keyboard,
  Info,
  Layout,
  Layers,
  Settings,
  MapPin,
  Ruler,
  Bell,
  BarChart3,
  Box,
  Lightbulb,
  Cog,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Mountain
} from 'lucide-react';

const HelpPanel = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          User Guide
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Essential controls and interface guide for the 3D viewer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="controls" className="h-full">
          <TabsList className="grid w-full grid-cols-2 m-3 mb-0">
            <TabsTrigger value="controls" className="flex items-center gap-1 text-xs">
              <Hand className="h-3 w-3" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="panels" className="flex items-center gap-1 text-xs">
              <Layout className="h-3 w-3" />
              Interface
            </TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="p-3 space-y-4">
            {/* Navigation Controls */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hand className="h-4 w-4 text-primary" />
                  Navigation Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-3 w-3 text-blue-500" />
                      <span>Rotate</span>
                    </div>
                    <div className="text-muted-foreground">Left drag / Single finger</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ZoomIn className="h-3 w-3 text-green-500" />
                      <span>Zoom</span>
                    </div>
                    <div className="text-muted-foreground">Wheel / Pinch</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Move className="h-3 w-3 text-purple-500" />
                      <span>Pan</span>
                    </div>
                    <div className="text-muted-foreground">Right drag / Two finger</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-orange-500" />
                      <span>Select</span>
                    </div>
                    <div className="text-muted-foreground">Left click / Tap</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-primary" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Zoom All</span>
                    <Badge variant="outline" className="text-xs h-5">A</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus Selected</span>
                    <Badge variant="outline" className="text-xs h-5">F</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Reset View</span>
                    <Badge variant="outline" className="text-xs h-5">R</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle Panel</span>
                    <Badge variant="outline" className="text-xs h-5">Tab</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Multi-select Objects</span>
                    <Badge variant="outline" className="text-xs h-5">Ctrl+Click</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aid Tools */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Aid Tools (Top Bar)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-500" />
                    <span>Select Tool - Click objects to select and inspect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-green-500" />
                    <span>Point Tool - Add measurement reference points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3 w-3 text-purple-500" />
                    <span>Measure Tool - Create distance measurements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="h-3 w-3 text-amber-500" />
                    <span>Left View - Switch to left side view</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-amber-500" />
                    <span>Right View - Switch to right side view</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-3 w-3 text-orange-500" />
                    <span>Camera & Notifications - Toggle orthographic view</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Bar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Status Bar (Bottom)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-3 w-3 text-blue-500" />
                    <span>Grid Toggle - Show/hide reference grid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-3 w-3 text-green-500" />
                    <span>Ground Plane - Show/hide ground reference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ZoomIn className="h-3 w-3 text-purple-500" />
                    <span>Zoom Controls - Zoom in/out and reset view</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="panels" className="p-3 space-y-4">
            {/* Left Control Panels */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Left Control Panels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2">
                  <div className="p-2 bg-accent/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Box className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">Scene Objects</span>
                    </div>
                    <div className="text-muted-foreground">Import models, manage scene hierarchy, add primitives</div>
                  </div>
                  <div className="p-2 bg-accent/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="h-3 w-3 text-green-500" />
                      <span className="font-medium">Object Properties</span>
                    </div>
                    <div className="text-muted-foreground">Edit materials, dimensions, transformations</div>
                  </div>
                  <div className="p-2 bg-accent/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">Lighting & Environment</span>
                    </div>
                    <div className="text-muted-foreground">Control sunlight, ambient lighting, environment</div>
                  </div>
                  <div className="p-2 bg-accent/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Cog className="h-3 w-3 text-purple-500" />
                      <span className="font-medium">Settings</span>
                    </div>
                    <div className="text-muted-foreground">Theme, measurement units, app preferences</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurement Panel */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  Measurement Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div>• View all active measurements with precise distances</div>
                  <div>• Delete individual measurements or clear all</div>
                  <div>• Export measurement data for external use</div>
                  <div>• Automatic unit conversion based on settings</div>
                </div>
              </CardContent>
            </Card>

            {/* File Import */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Box className="h-4 w-4 text-primary" />
                  Model Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div>• Supported formats: GLTF, GLB, FBX, OBJ</div>
                  <div>• Drag & drop files or use file browser</div>
                  <div>• Multiple models can be loaded simultaneously</div>
                  <div>• Models are automatically centered and scaled</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpPanel;