
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Box, Triangle, Sun, TreePine, MapPin, Eye, EyeOff, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import type { SceneObject } from '../../types/model';

interface EnhancedPropertyPanelProps {
  selectedObject: SceneObject | null;
  onPropertyChange: (property: string, value: any) => void;
  onToggleOrthographic?: () => void;
}

const EnhancedPropertyPanel = ({ selectedObject, onPropertyChange, onToggleOrthographic }: EnhancedPropertyPanelProps) => {

  if (!selectedObject) {
    return (
      <div className="space-y-4 p-4">
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Properties
              </div>
              {onToggleOrthographic && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onToggleOrthographic}
                  className="h-7 w-7 p-0"
                  title="Toggle Orthographic Camera"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center py-6 text-muted-foreground">
              <Settings className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No object selected</p>
              <p className="text-xs opacity-70">Select an object to view its properties</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'mesh':
        return <Triangle className="h-5 w-5 text-green-400" />;
      case 'group':
        return <Box className="h-5 w-5 text-blue-400" />;
      case 'primitive':
        return <Box className="h-5 w-5 text-purple-400" />;
      case 'ground':
        return <TreePine className="h-5 w-5 text-brown-400" />;
      case 'light':
        return <Sun className="h-5 w-5 text-yellow-400" />;
      case 'point':
        return <MapPin className="h-5 w-5 text-red-400" />;
      default:
        return <Settings className="h-5 w-5 text-gray-400" />;
    }
  };

  // Extract object metadata
  const extractObjectMetadata = (object: THREE.Object3D) => {
    const userData = object.userData;
    
    // Check for object_params first, then direct userData
    let metadataSource = userData?.object_params || userData;
    
    // Check for required fields - allow empty strings as valid values  
    const hasId = metadataSource?.id !== undefined;
    const hasName = metadataSource?.name !== undefined;
    const hasParentId = metadataSource?.parent_id !== undefined;
    const hasType = metadataSource?.type !== undefined;
    const hasFunction = metadataSource?.function !== undefined;
    
    if (hasId && hasName && hasParentId && hasType && hasFunction) {
      return {
        id: String(metadataSource.id),
        name: metadataSource.name === "" ? "(empty)" : String(metadataSource.name),
        parent_id: metadataSource.parent_id === "" ? "(empty)" : String(metadataSource.parent_id),
        type: String(metadataSource.type),
        function: metadataSource.function === "" ? "(empty)" : String(metadataSource.function),
        hasValidMetadata: true
      };
    }
    
    return {
      hasValidMetadata: false,
      error: 'Missing required metadata fields',
      availableFields: Object.keys(metadataSource || {}),
      rawUserData: userData
    };
  };

  const objectMetadata = extractObjectMetadata(selectedObject.object);

  return (
    <div className="space-y-3 p-3">
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getObjectIcon(selectedObject.type)}
              Properties
            </div>
            {onToggleOrthographic && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleOrthographic}
                className="h-7 w-7 p-0"
                title="Toggle Orthographic Camera"
              >
                <Camera className="h-3 w-3" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Object Metadata */}
          {objectMetadata.hasValidMetadata ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Object Properties</Label>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-right max-w-[120px] truncate">{'id' in objectMetadata ? objectMetadata.id : ''}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-right max-w-[120px] truncate">{'name' in objectMetadata ? objectMetadata.name : ''}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-right max-w-[120px] truncate">{'type' in objectMetadata ? objectMetadata.type : ''}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Function:</span>
                  <span className="text-right max-w-[120px] truncate">{'function' in objectMetadata ? objectMetadata.function : ''}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Object Properties</Label>
              <div className="text-xs text-muted-foreground py-2">
                No metadata available
              </div>
            </div>
          )}

          {/* Visibility Control */}
          <Separator />
          <div className="space-y-2">
            <Button
              size="sm"
              variant={selectedObject.visible ? "default" : "outline"}
              onClick={() => onPropertyChange('visibility', !selectedObject.visible)}
              className="w-full flex items-center gap-2 h-8"
            >
              {selectedObject.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {selectedObject.visible ? 'Visible' : 'Hidden'}
            </Button>
          </div>

          {/* Material Properties - only for meshes */}
          {selectedObject.type === 'mesh' && selectedObject.object instanceof THREE.Mesh && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Material</Label>
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-right max-w-[120px] truncate">
                    {Array.isArray(selectedObject.object.material) 
                      ? selectedObject.object.material.map(m => m.type).join(', ')
                      : selectedObject.object.material?.type || 'None'
                    }
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPropertyPanel;
