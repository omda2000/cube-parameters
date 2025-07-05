
import { Upload, FolderTree, Box, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <TooltipProvider>
      <div className="space-y-3 p-2">
        {/* Enhanced Header with icons and search */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-200">Scene Objects</span>
            <div className="flex-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter Options</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <Input
              placeholder="Search objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-7 bg-slate-700/50 border-slate-600/50 text-slate-200 text-xs placeholder:text-slate-400"
            />
          </div>

          {/* Filter options (collapsible) */}
          {showFilters && (
            <div className="space-y-1 p-2 bg-slate-700/30 rounded border border-slate-600/30">
              <div className="flex items-center gap-2 text-xs">
                <input type="checkbox" id="show-meshes" className="w-3 h-3" defaultChecked />
                <label htmlFor="show-meshes" className="text-slate-700 dark:text-slate-300">Show Meshes</label>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <input type="checkbox" id="show-lights" className="w-3 h-3" defaultChecked />
                <label htmlFor="show-lights" className="text-slate-700 dark:text-slate-300">Show Lights</label>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <input type="checkbox" id="show-cameras" className="w-3 h-3" />
                <label htmlFor="show-cameras" className="text-slate-700 dark:text-slate-300">Show Cameras</label>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Upload section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Upload className="h-3 w-3" />
            <span>Import Models</span>
          </div>
          
          <div className="p-3 border-2 border-dashed border-slate-600/50 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors">
            <FileUploadDialog 
              onFileSelect={onFileUpload} 
              isLoading={isUploading}
            />
            <p className="text-xs text-slate-400 mt-1 text-center">
              Drag & drop or click to upload 3D models
            </p>
          </div>
        </div>

        {/* Upload error display */}
        {uploadError && (
          <div className="p-2 bg-red-900/30 border border-red-800/50 rounded text-red-200 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-red-400">⚠</span>
              <span>{uploadError}</span>
            </div>
          </div>
        )}

        {/* Models count indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-600/30 pt-2">
          <Box className="h-3 w-3" />
          <span>{loadedModels.length} model{loadedModels.length !== 1 ? 's' : ''} loaded</span>
          {currentModel && (
            <span className="text-indigo-400">• {currentModel.name} active</span>
          )}
        </div>

        {/* Enhanced Scene tree */}
        <div className="border-t border-slate-600/30 pt-2">
          <UnifiedSceneTree
            loadedModels={loadedModels}
            currentModel={currentModel}
            showPrimitives={true}
            scene={scene}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SceneTab;
