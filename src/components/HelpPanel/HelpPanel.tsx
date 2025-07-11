
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
  BarChart3
} from 'lucide-react';

const HelpPanel = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Info className="h-4 w-4" />
          User Guide
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Learn how to navigate and use the 3D viewer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="touch" className="h-full">
          <TabsList className="grid w-full grid-cols-3 m-3 mb-0">
            <TabsTrigger value="touch" className="flex items-center gap-1 text-xs">
              <Smartphone className="h-3 w-3" />
              Touch
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-1 text-xs">
              <Mouse className="h-3 w-3" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex items-center gap-1 text-xs">
              <Layout className="h-3 w-3" />
              UI Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="touch" className="p-3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hand className="h-4 w-4" />
                  Touch Gestures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>Rotate View</span>
                  <Badge variant="outline">Single finger drag</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zoom In/Out</span>
                  <Badge variant="outline">Pinch gesture</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pan View</span>
                  <Badge variant="outline">Two finger drag</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Select Object</span>
                  <Badge variant="outline">Single tap</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reset View</span>
                  <Badge variant="outline">Three finger tap</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tool Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>Use the toolbar at the top to switch between:</div>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Select Tool:</strong> Choose objects</li>
                  <li>• <strong>Point Tool:</strong> Add measurement points</li>
                  <li>• <strong>Measure Tool:</strong> Create measurements</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desktop" className="p-3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mouse className="h-4 w-4" />
                  Mouse Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>Rotate View</span>
                  <Badge variant="outline">Left click + drag</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pan View</span>
                  <Badge variant="outline">Right click + drag</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zoom</span>
                  <Badge variant="outline">Mouse wheel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Select Object</span>
                  <Badge variant="outline">Left click</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>Zoom All</span>
                  <Badge variant="outline">A</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Focus Selected</span>
                  <Badge variant="outline">F</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reset View</span>
                  <Badge variant="outline">R</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Toggle Panel</span>
                  <Badge variant="outline">Tab</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cancel/Escape</span>
                  <Badge variant="outline">Esc</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Navigation Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>• Hold <Badge variant="outline" className="mx-1">Shift</Badge> while dragging for precise control</p>
                <p>• Use <Badge variant="outline" className="mx-1">Ctrl + Z</Badge> to undo actions</p>
                <p>• Double-click objects to focus on them</p>
                <p>• Use the bottom status bar for coordinate reference</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ui" className="p-3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Aid Tools Bar
                </CardTitle>
                <CardDescription className="text-xs">Top center toolbar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  <span><strong>Select Tool:</strong> Click objects to select them</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span><strong>Point Tool:</strong> Click to add measurement points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-3 w-3" />
                  <span><strong>Measure Tool:</strong> Create distance measurements</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Left Sidebar
                </CardTitle>
                <CardDescription className="text-xs">Navigation and panel access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>Access different control panels:</div>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Scene:</strong> Import and manage 3D models</li>
                  <li>• <strong>Properties:</strong> Object properties and settings</li>
                  <li>• <strong>Lighting:</strong> Light and shadow controls</li>
                  <li>• <strong>View:</strong> Environment and camera settings</li>
                  <li>• <strong>Settings:</strong> Application preferences</li>
                  <li>• <strong>Help:</strong> This user guide</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Measure Panel
                </CardTitle>
                <CardDescription className="text-xs">Opens when using measurement tools</CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>• View all measurements and their distances</p>
                <p>• Delete individual measurements</p>
                <p>• Clear all measurements at once</p>
                <p>• Export measurement data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Status Bar
                </CardTitle>
                <CardDescription className="text-xs">Bottom of the screen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div><strong>Left side:</strong> Object count, grid info, cursor position</div>
                <div><strong>Center:</strong> Zoom controls and view options</div>
                <div><strong>Right side:</strong> Shade type selector</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Bell
                </CardTitle>
                <CardDescription className="text-xs">Top right corner</CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>• Shows system notifications and alerts</p>
                <p>• File upload status and errors</p>
                <p>• Performance warnings</p>
                <p>• Success confirmations</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpPanel;
