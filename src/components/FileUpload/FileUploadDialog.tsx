
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
    
    // Enhanced validation for iOS - check both extension and MIME type
    const validExtensions = ['.fbx', '.obj', '.gltf', '.glb'];
    const validMimeTypes = [
      'application/octet-stream', // Common for FBX/OBJ on iOS
      'model/gltf+json',
      'model/gltf-binary',
      'application/json', // Sometimes GLTF files
      'text/plain', // Sometimes OBJ files on iOS
      '', // iOS Safari sometimes reports empty MIME type
    ];
    
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = validMimeTypes.includes(file.type) || file.type === '';
    
    // More lenient validation for iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isValid = hasValidExtension && (hasValidMimeType || isIOS);
    
    if (!isValid) {
      console.warn('Invalid file type:', { name: file.name, type: file.type, extension: fileName.split('.').pop() });
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
    console.log('File input change triggered');
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      onFileSelect(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleBrowseClick = () => {
    console.log('Browse button clicked');
    if (fileInputRef.current) {
      // Clear the input value to allow re-selecting the same file
      fileInputRef.current.value = '';
      fileInputRef.current.click();
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
          onClick={handleBrowseClick}
        >
          Browse Files
        </Button>
        
        {/* Enhanced file input for iOS compatibility */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".fbx,.obj,.gltf,.glb,application/octet-stream,model/gltf+json,model/gltf-binary"
          onChange={handleFileInputChange}
          multiple={false}
          capture={false}
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
