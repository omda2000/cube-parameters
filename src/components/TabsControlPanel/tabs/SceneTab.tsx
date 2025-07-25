
import { Upload, FolderTree, Search, Filter, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import FileUploadDialog from '../../FileUpload/FileUploadDialog';
import UnifiedSceneTree from '../../UnifiedSceneTree/UnifiedSceneTree';
import * as THREE from 'three';
import type { LoadedModel } from '../../../types/model';

interface SceneTabProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  isUploading: boolean;
  uploadError: string | null;
  onFileUpload: (file: File) => void;
  scene?: THREE.Scene | null;
}

const SceneTab = ({
  loadedModels,
  currentModel,
  isUploading,
  uploadError,
  onFileUpload,
  scene
}: SceneTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        {/* Search and Filter Controls */}
        <div className="p-3 space-y-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
            <Input
              placeholder="Search objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-7 bg-gray-50 border-gray-200 text-gray-900 text-xs placeholder:text-gray-500"
            />
          </div>

          {/* Filter Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="selected-only"
                checked={showSelectedOnly}
                onCheckedChange={setShowSelectedOnly}
                className="scale-75"
              />
              <Label htmlFor="selected-only" className="text-xs text-gray-600">
                Selected only
              </Label>
            </div>
            
            <div className="text-xs text-gray-500">
              {loadedModels.length} model{loadedModels.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Upload Error Display */}
        {uploadError && (
          <div className="mx-3 mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠</span>
              <span>{uploadError}</span>
            </div>
          </div>
        )}

        {/* Scene Tree - Single scroll container */}
        <div className="flex-1 overflow-hidden">
          <UnifiedSceneTree
            loadedModels={loadedModels}
            currentModel={currentModel}
            showPrimitives={true}
            scene={scene}
            searchQuery={searchQuery}
            showSelectedOnly={showSelectedOnly}
          />
        </div>

        {/* Compact Upload Dialog */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg border border-gray-200 max-w-sm w-full mx-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Import 3D Model</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadDialog(false)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3">
                <FileUploadDialog 
                  onFileSelect={(file) => {
                    onFileUpload(file);
                    setShowUploadDialog(false);
                  }} 
                  isLoading={isUploading}
                />
                <p className="text-xs text-gray-500 text-center">
                  Supports FBX, OBJ, and GLTF formats
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SceneTab;
