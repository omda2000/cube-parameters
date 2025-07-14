
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

  // Extract GLTF metadata from userData (previously extracted from extras.object_params)
  const extractGLTFMetadata = (object: THREE.Object3D) => {
    const userData = object.userData;
    
    console.log('🔍 PropertyPanel: Extracting GLTF metadata from object:', object.name);
    console.log('🔍 PropertyPanel: userData:', userData);
    
    // Check if we have the required Rhino metadata fields in userData
    // The metadata should be stored directly in userData (not nested)
    const metadataSource = userData;
    
    console.log('🔍 PropertyPanel: Metadata source:', metadataSource);
    
    // Check for required fields - allow empty strings as valid values  
    const hasId = metadataSource?.id !== undefined;
    const hasName = metadataSource?.name !== undefined;
    const hasParentId = metadataSource?.parent_id !== undefined;
    const hasType = metadataSource?.type !== undefined;
    const hasFunction = metadataSource?.function !== undefined;
    
    console.log('🔍 PropertyPanel: Field availability:', {
      hasId,
      hasName,
      hasParentId,
      hasType,
      hasFunction,
      actualValues: {
        id: metadataSource?.id,
        name: metadataSource?.name,
        parent_id: metadataSource?.parent_id,
        type: metadataSource?.type,
        function: metadataSource?.function
      }
    });
    
    if (hasId && hasName && hasParentId && hasType && hasFunction) {
      const result = {
        id: String(metadataSource.id),
        name: metadataSource.name === "" ? "(empty)" : String(metadataSource.name),
        parent_id: metadataSource.parent_id === "" ? "(empty)" : String(metadataSource.parent_id),
        type: String(metadataSource.type),
        function: metadataSource.function === "" ? "(empty)" : String(metadataSource.function),
        hasValidMetadata: true
      };
      console.log('✅ PropertyPanel: Successfully extracted metadata:', result);
      return result;
    }
    
    // Provide detailed error information
    const missingFields = [];
    if (!hasId) missingFields.push('id');
    if (!hasName) missingFields.push('name');
    if (!hasParentId) missingFields.push('parent_id');
    if (!hasType) missingFields.push('type');
    if (!hasFunction) missingFields.push('function');
    
    return {
      hasValidMetadata: false,
      error: `Missing required Rhino metadata fields: ${missingFields.join(', ')}`,
      availableFields: Object.keys(metadataSource || {}),
      rawUserData: userData
    };
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
          {/* GLTF Object Properties from Rhino */}
          {!gltfMetadata.hasValidMetadata ? (
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Rhino Metadata Missing</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {'error' in gltfMetadata ? gltfMetadata.error : 'Missing metadata'}
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Expected: id, name, parent_id, type, function from GLTF extras.object_params
                </p>
                {'availableFields' in gltfMetadata && gltfMetadata.availableFields && gltfMetadata.availableFields.length > 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Available fields: {gltfMetadata.availableFields.join(', ')}
                  </p>
                )}
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-slate-600 dark:text-slate-400">
                    Show raw userData (debug)
                  </summary>
                  <pre className="text-xs mt-1 p-2 bg-slate-100 dark:bg-slate-800 rounded overflow-auto max-h-32">
                    {JSON.stringify('rawUserData' in gltfMetadata ? gltfMetadata.rawUserData : {}, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rhino Object Properties</Label>
              
              <div>
                <Label className="text-xs text-slate-500">ID</Label>
                <Input
                  value={'id' in gltfMetadata ? gltfMetadata.id : ''}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-500">Name</Label>
                <Input
                  value={'name' in gltfMetadata ? gltfMetadata.name : ''}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-500">Type</Label>
                <Input
                  value={'type' in gltfMetadata ? gltfMetadata.type : ''}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-500">Function</Label>
                <Input
                  value={'function' in gltfMetadata ? gltfMetadata.function : ''}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-500">Parent ID</Label>
                <Input
                  value={'parent_id' in gltfMetadata ? gltfMetadata.parent_id : ''}
                  readOnly
                  className="mt-1 bg-slate-100 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          )}

          {/* Basic Object Info */}
          <Separator />
          <div className="space-y-3">
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
