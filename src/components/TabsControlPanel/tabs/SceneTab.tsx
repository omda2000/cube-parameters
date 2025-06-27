
import { Upload, FolderTree, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import FileUploadDialog from '../../FileUpload/FileUploadDialog';
import UnifiedSceneTree from '../../UnifiedSceneTree/UnifiedSceneTree';
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
  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header with icons */}
        <div className="flex items-center gap-1 mb-2">
          <FolderTree className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">Scene</span>
        </div>

        {/* Upload section - icon only */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <FileUploadDialog 
                  onFileSelect={onFileUpload} 
                  isLoading={isUploading}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload 3D Model</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {uploadError && (
          <div className="p-2 bg-red-900/30 border border-red-800/50 rounded text-red-200 text-xs">
            {uploadError}
          </div>
        )}

        {/* Scene tree - compact version */}
        <div className="mt-2">
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
