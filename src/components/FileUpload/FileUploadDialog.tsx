
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
    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    // More flexible file type checking for mobile browsers
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.fbx', '.obj', '.gltf', '.glb'];
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    // iOS Safari might not set correct MIME types, so we rely more on file extension
    const validMimeTypes = [
      'application/octet-stream', // Common for .fbx files
      'text/plain', // Sometimes used for .obj files
      'model/gltf+json', // GLTF files
      'model/gltf-binary', // GLB files
      '', // Empty mime type (iOS Safari sometimes doesn't set it)
    ];
    
    const isValidMimeType = validMimeTypes.includes(file.type) || file.type === '';
    
    if (!isValidExtension) {
      alert('Please select a valid 3D model file (.fbx, .obj, .gltf, .glb)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size too large. Please select a file smaller than 50MB.');
      return;
    }

    console.log('File validation passed, setting selected file');
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed, files:', e.target.files);
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    console.log('Browse button clicked');
    if (fileInputRef.current) {
      // Reset the input value to allow selecting the same file again
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
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
          Tap to select your 3D model file
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Supported formats: FBX, OBJ, GLTF, GLB (Max 50MB)
        </p>
        <Button
          variant="outline"
          size="sm"
          className="text-slate-300 border-slate-600"
          onClick={handleBrowseClick}
        >
          Select File
        </Button>
        {/* Enhanced file input for better mobile support */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".fbx,.obj,.gltf,.glb,application/octet-stream,text/plain,model/gltf+json,model/gltf-binary"
          onChange={handleFileInputChange}
          capture={false}
          multiple={false}
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
