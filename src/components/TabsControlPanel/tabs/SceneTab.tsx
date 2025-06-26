
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Box, Eye, EyeOff } from 'lucide-react';
import FileUploadDialog from '../../FileUpload/FileUploadDialog';
import UnifiedSceneTree from '../../UnifiedSceneTree/UnifiedSceneTree';
import type { LoadedModel } from '../../../types/model';
import * as THREE from 'three';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

interface SceneTabProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  isUploading: boolean;
  uploadError: string | null;
  onFileUpload: (file: File) => void;
  scene?: THREE.Scene | null;
  measurements?: MeasureData[];
  onRemoveMeasurement?: (id: string) => void;
}

const SceneTab = ({ 
  loadedModels, 
  currentModel, 
  isUploading, 
  uploadError,
  onFileUpload,
  scene,
  measurements,
  onRemoveMeasurement
}: SceneTabProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPrimitives, setShowPrimitives] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Box className="h-5 w-5 text-indigo-400" />
          Scene
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUploadDialog(true)}
          disabled={isUploading}
          className="text-slate-300 border-slate-600 hover:bg-slate-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      {uploadError && (
        <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
          {uploadError}
        </div>
      )}

      <Separator className="bg-slate-700/50" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300">Show Primitives</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPrimitives(!showPrimitives)}
          className="h-6 w-6 p-0 text-slate-400"
        >
          {showPrimitives ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>

      <UnifiedSceneTree
        loadedModels={loadedModels}
        currentModel={currentModel}
        showPrimitives={showPrimitives}
        scene={scene}
        measurements={measurements}
        onRemoveMeasurement={onRemoveMeasurement}
      />

      <FileUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onFileUpload={onFileUpload}
        isUploading={isUploading}
        uploadError={uploadError}
      />
    </div>
  );
};

export default SceneTab;
