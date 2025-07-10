
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';

interface FileUploadDialogProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUploadDialog = ({ onFileSelect, isLoading }: FileUploadDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    const validTypes = ['.fbx', '.obj', '.gltf', '.glb'];
    const isValid = validTypes.some(type => file.name.toLowerCase().endsWith(type));
    
    if (!isValid) {
      alert('Please select a valid 3D model file (.fbx, .obj, .gltf, .glb)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size too large. Please select a file smaller than 50MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-green-400 bg-green-400/10' 
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-slate-400" />
        <p className="text-slate-300 mb-2 text-sm">
          Drag and drop your 3D model here, or click to browse
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Supported formats: FBX, OBJ, GLTF, GLB (Max 50MB)
        </p>
        <Button
          variant="outline"
          size="sm"
          className="text-slate-300 border-slate-600"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".fbx,.obj,.gltf,.glb"
          onChange={handleFileInputChange}
        />
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-green-400" />
            <span className="text-sm text-slate-300">{selectedFile.name}</span>
            <span className="text-xs text-slate-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload Model'}
      </Button>
    </div>
  );
};

export default FileUploadDialog;
