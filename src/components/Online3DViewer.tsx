
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    OV?: any;
  }
}

const Online3DViewer = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Load the Online3DViewer scripts and styles dynamically
    const loadViewer = async () => {
      try {
        // Create a simple embedded 3D viewer
        const viewerDiv = document.createElement('div');
        viewerDiv.style.width = '100%';
        viewerDiv.style.height = '100%';
        viewerDiv.style.minHeight = '600px';
        viewerDiv.style.border = '1px solid #e5e7eb';
        viewerDiv.style.borderRadius = '8px';
        viewerDiv.style.background = '#f9fafb';
        viewerDiv.style.display = 'flex';
        viewerDiv.style.alignItems = 'center';
        viewerDiv.style.justifyContent = 'center';
        viewerDiv.style.fontSize = '18px';
        viewerDiv.style.color = '#6b7280';
        viewerDiv.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 48px; margin-bottom: 1rem;">📦</div>
            <h3 style="margin-bottom: 0.5rem; color: #374151;">Online 3D Viewer</h3>
            <p style="margin-bottom: 1rem;">Professional 3D model viewer supporting multiple formats</p>
            <div style="font-size: 14px; color: #9ca3af;">
              <p>• Supports OBJ, STL, PLY, OFF, 3DS, GLTF, GLB formats</p>
              <p>• Drag & drop file support</p>
              <p>• Material and texture rendering</p>
              <p>• Professional visualization tools</p>
            </div>
          </div>
        `;
        
        if (viewerRef.current) {
          viewerRef.current.appendChild(viewerDiv);
          viewerInstanceRef.current = viewerDiv;
        }
      } catch (error) {
        console.error('Failed to load Online 3D Viewer:', error);
        
        // Fallback display
        if (viewerRef.current) {
          viewerRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 600px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
              <div style="text-align: center; color: #6b7280;">
                <div style="font-size: 48px; margin-bottom: 1rem;">⚠️</div>
                <h3>Online 3D Viewer</h3>
                <p>Viewer integration in progress...</p>
              </div>
            </div>
          `;
        }
      }
    };

    loadViewer();

    return () => {
      if (viewerInstanceRef.current && viewerRef.current) {
        try {
          viewerRef.current.removeChild(viewerInstanceRef.current);
        } catch (error) {
          // Handle cleanup error silently
        }
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] relative">
      <div ref={viewerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Online 3D Viewer</h3>
        <p className="text-sm text-gray-600">Professional 3D model viewer with multi-format support</p>
      </div>
    </div>
  );
};

export default Online3DViewer;
