import React, { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';

const HelpPanel = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          User Guide
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Complete guide to navigate and use the 3D architectural viewer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="touch" className="h-full">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            <TabsTrigger value="touch" className="flex items-center gap-2 text-sm">
              <Smartphone className="h-4 w-4" />
              Touch Controls
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-2 text-sm">
              <Mouse className="h-4 w-4" />
              Desktop Controls
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex items-center gap-2 text-sm">
              <Layout className="h-4 w-4" />
              Interface Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="touch" className="p-4 space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hand className="h-5 w-5 text-primary" />
                  Touch Navigation
                </CardTitle>
                <CardDescription>Essential gestures for mobile interaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Rotate View</span>
                    </div>
                    <Badge variant="secondary">Single finger drag</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ZoomIn className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Zoom In/Out</span>
                    </div>
                    <Badge variant="secondary">Pinch gesture</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Move className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Pan View</span>
                    </div>
                    <Badge variant="secondary">Two finger drag</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Select Object</span>
                    </div>
                    <Badge variant="secondary">Single tap</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Advanced Touch Gestures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p>• <strong>Three finger tap:</strong> Reset view to default position</p>
                  <p>• <strong>Double tap object:</strong> Focus camera on selected object</p>
                  <p>• <strong>Long press:</strong> Access context menu for objects</p>
                  <p>• <strong>Edge swipe:</strong> Toggle UI panels visibility</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desktop" className="p-4 space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mouse className="h-5 w-5 text-primary" />
                  Mouse Controls
                </CardTitle>
                <CardDescription>Precise navigation for desktop users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Rotate View</span>
                    </div>
                    <Badge variant="secondary">Left click + drag</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Move className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Pan View</span>
                    </div>
                    <Badge variant="secondary">Right click + drag</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ZoomIn className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Zoom</span>
                    </div>
                    <Badge variant="secondary">Mouse wheel</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Select Object</span>
                    </div>
                    <Badge variant="secondary">Left click</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription>Boost your productivity with shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 rounded">
                    <span>Zoom All</span>
                    <Badge variant="outline">A</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span>Focus Selected</span>
                    <Badge variant="outline">F</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span>Reset View</span>
                    <Badge variant="outline">R</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span>Toggle Panel</span>
                    <Badge variant="outline">Tab</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span>Cancel/Escape</span>
                    <Badge variant="outline">Esc</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span>Undo Action</span>
                    <Badge variant="outline">Ctrl+Z</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Hold <Badge variant="outline" className="mx-1">Shift</Badge> while dragging for precise control</p>
                <p>• Double-click objects to focus camera on them</p>
                <p>• Use <Badge variant="outline" className="mx-1">Middle mouse</Badge> for alternative pan mode</p>
                <p>• Hold <Badge variant="outline" className="mx-1">Alt</Badge> for smooth camera transitions</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ui" className="p-4 space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Aid Tools Bar
                </CardTitle>
                <CardDescription>Top center toolbar for quick actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Target className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Select Tool</div>
                      <div className="text-muted-foreground">Click objects to select and inspect them</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">Point Tool</div>
                      <div className="text-muted-foreground">Click to add measurement reference points</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Ruler className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium">Measure Tool</div>
                      <div className="text-muted-foreground">Create distance measurements between points</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Bell className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="font-medium">Notifications & Camera</div>
                      <div className="text-muted-foreground">View system alerts and toggle orthographic camera</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Left Control Panel
                </CardTitle>
                <CardDescription>Vertical toolbar for accessing different panels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Scene Objects</div>
                      <div className="text-muted-foreground">Import, manage and organize 3D models and objects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Settings className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">Object Properties</div>
                      <div className="text-muted-foreground">Edit object properties, materials, and dimensions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="font-medium">Lighting & Environment</div>
                      <div className="text-muted-foreground">Control lighting, shadows, and environment presets</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <Cog className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium">Settings</div>
                      <div className="text-muted-foreground">App preferences, units, and display options</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <HelpCircle className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="font-medium">User Guide</div>
                      <div className="text-muted-foreground">This comprehensive help documentation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Status Bar
                </CardTitle>
                <CardDescription>Bottom toolbar with essential information and quick controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="font-medium mb-1">Left Section</div>
                    <div className="text-muted-foreground text-xs">
                      • Object count<br/>
                      • Grid information<br/>
                      • Cursor coordinates
                    </div>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="font-medium mb-1">Center Section</div>
                    <div className="text-muted-foreground text-xs">
                      • Zoom controls<br/>
                      • View reset options<br/>
                      • Grid & ground toggles
                    </div>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="font-medium mb-1">Right Section</div>
                    <div className="text-muted-foreground text-xs">
                      • Shading mode selector<br/>
                      • Material visualization<br/>
                      • Rendering options
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  Measurement Panel
                </CardTitle>
                <CardDescription>Precision measurement tools and data management</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="space-y-2">
                  <p>• <strong>View measurements:</strong> All active measurements with precise distances</p>
                  <p>• <strong>Delete individual:</strong> Remove specific measurements as needed</p>
                  <p>• <strong>Clear all:</strong> Remove all measurements at once</p>
                  <p>• <strong>Export data:</strong> Save measurement data for external use</p>
                  <p>• <strong>Units display:</strong> Automatic conversion based on your preferred units</p>
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