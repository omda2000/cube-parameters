import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Box, Triangle, Sun, TreePine, MapPin, Edit3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnits } from '@/contexts/UnitsContext';
import * as THREE from 'three';
import type { SceneObject } from '../../types/model';

interface EnhancedPropertyPanelProps {
  selectedObject: SceneObject | null;
  onPropertyChange: (property: string, value: any) => void;
}

const EnhancedPropertyPanel = ({ selectedObject, onPropertyChange }: EnhancedPropertyPanelProps) => {
  const { formatValue, convertValue } = useUnits();

  if (!selectedObject) {
    return (
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-400" />
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-400">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No object selected</p>
              <p className="text-xs">Select an object to view its properties</p>
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

  // Extract GLTF metadata if available
  const extractGLTFMetadata = (object: THREE.Object3D) => {
    const userData = object.userData;
    if (userData?.originalMetadata || userData?.id) {
      return {
        id: userData.id || userData.originalMetadata?.id,
        type: userData.type || userData.originalMetadata?.type,
        function: userData.originalMetadata?.params?.function || 'N/A',
        parentId: userData.originalMetadata?.parent_id || 'None'
      };
    }
    return null;
  };

  const gltfMetadata = extractGLTFMetadata(selectedObject.object);

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {getObjectIcon(selectedObject.type)}
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Properties */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={selectedObject.name}
                  onChange={(e) => onPropertyChange('name', e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" variant="outline">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">ID</Label>
              <Input
                value={selectedObject.id}
                readOnly
                className="mt-1 bg-slate-100 dark:bg-slate-800"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</Label>
              <Input
                value={selectedObject.type}
                readOnly
                className="mt-1 bg-slate-100 dark:bg-slate-800"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Visibility</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  size="sm"
                  variant={selectedObject.visible ? "default" : "outline"}
                  onClick={() => onPropertyChange('visibility', !selectedObject.visible)}
                  className="flex items-center gap-2"
                >
                  {selectedObject.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {selectedObject.visible ? 'Visible' : 'Hidden'}
                </Button>
              </div>
            </div>
          </div>

          {/* GLTF Metadata - only show if available */}
          {gltfMetadata && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">GLTF Data</Label>
                
                <div>
                  <Label className="text-xs text-slate-500">Function</Label>
                  <Input
                    value={gltfMetadata.function}
                    readOnly
                    className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs text-slate-500">Parent ID</Label>
                  <Input
                    value={gltfMetadata.parentId}
                    readOnly
                    className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* Transform Properties */}
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transform</Label>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-slate-500">Position X</Label>
                <Input
                  value={formatValue(convertValue(selectedObject.object.position.x))}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Position Y</Label>
                <Input
                  value={formatValue(convertValue(selectedObject.object.position.y))}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Position Z</Label>
                <Input
                  value={formatValue(convertValue(selectedObject.object.position.z))}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-slate-500">Scale X</Label>
                <Input
                  value={selectedObject.object.scale.x.toFixed(2)}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Scale Y</Label>
                <Input
                  value={selectedObject.object.scale.y.toFixed(2)}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Scale Z</Label>
                <Input
                  value={selectedObject.object.scale.z.toFixed(2)}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Material Properties - only for meshes */}
          {selectedObject.type === 'mesh' && selectedObject.object instanceof THREE.Mesh && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Material</Label>
                <div>
                  <Label className="text-xs text-slate-500">Material Type</Label>
                  <Input
                    value={Array.isArray(selectedObject.object.material) 
                      ? selectedObject.object.material.map(m => m.type).join(', ')
                      : selectedObject.object.material?.type || 'No material'
                    }
                    readOnly
                    className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                  />
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