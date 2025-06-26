
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
  measurements?: Array<{
    id: string;
    startPoint: { x: number; y: number; z: number };
    endPoint: { x: number; y: number; z: number };
    distance: number;
    label: string;
  }>;
  points?: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    name: string;
  }>;
  onRemoveMeasurement?: (id: string) => void;
  onRemovePoint?: (id: string) => void;
}

const SceneTab = ({
  loadedModels,
  currentModel,
  isUploading,
  uploadError,
  onFileUpload,
  scene,
  measurements,
  points,
  onRemoveMeasurement,
  onRemovePoint
}: SceneTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <FileUploadDialog 
          onFileSelect={onFileUpload} 
          isLoading={isUploading}
        />
      </div>

      {uploadError && (
        <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-200 text-sm">
          {uploadError}
        </div>
      )}

      <UnifiedSceneTree
        loadedModels={loadedModels}
        currentModel={currentModel}
        showPrimitives={true}
        scene={scene}
        measurements={measurements}
        points={points}
        onRemoveMeasurement={onRemoveMeasurement}
        onRemovePoint={onRemovePoint}
      />
    </div>
  );
};

export default SceneTab;
