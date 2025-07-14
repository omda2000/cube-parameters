import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Triangle, Tag, Hash, Layers } from 'lucide-react';
import type { SceneObject } from '../../types/model';

interface ObjectPropertyOverlayProps {
  selectedObject: SceneObject | null;
}

const ObjectPropertyOverlay = ({ selectedObject }: ObjectPropertyOverlayProps) => {
  if (!selectedObject) return null;

  // Extract metadata from userData (populated by GLTF loader)
  const userData = selectedObject.object.userData;
  const metadata = {
    id: userData?.id || selectedObject.id,
    name: userData?.name || selectedObject.name,
    parent_id: userData?.parent_id || 'None',
    type: userData?.type || selectedObject.type,
    function: userData?.function || 'None'
  };

  return (
    <div className="absolute top-4 right-4 z-50 pointer-events-none">
      <Card className="w-80 bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Triangle className="h-4 w-4 text-primary" />
            Object Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Hash className="h-3 w-3" />
                ID
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {metadata.id}
              </Badge>
            </div>
            
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Tag className="h-3 w-3" />
                Name
              </div>
              <Badge variant="secondary" className="text-xs">
                {metadata.name}
              </Badge>
            </div>
            
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Layers className="h-3 w-3" />
                Type
              </div>
              <Badge variant="outline" className="text-xs">
                {metadata.type}
              </Badge>
            </div>
            
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Triangle className="h-3 w-3" />
                Function
              </div>
              <Badge variant="outline" className="text-xs">
                {metadata.function}
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center gap-1 text-muted-foreground mb-1 text-xs">
              <Hash className="h-3 w-3" />
              Parent ID
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {metadata.parent_id}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectPropertyOverlay;