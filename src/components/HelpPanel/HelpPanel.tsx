
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
  Info
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
          <TabsList className="grid w-full grid-cols-2 m-3 mb-0">
            <TabsTrigger value="touch" className="flex items-center gap-2 text-xs">
              <Smartphone className="h-3 w-3" />
              Touch Controls
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-2 text-xs">
              <Mouse className="h-3 w-3" />
              Desktop Controls
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
                  <li>• <strong>Move Tool:</strong> Transform objects</li>
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
        </Tabs>
      </div>
    </div>
  );
};

export default HelpPanel;
