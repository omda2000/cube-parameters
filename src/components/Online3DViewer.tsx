
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

    const loadViewer = async () => {
      try {
        // Load CSS if not already loaded
        if (!document.querySelector('link[href="/o3dv.min.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = '/o3dv.min.css';
          document.head.appendChild(cssLink);
        }

        // Load JS if not already loaded
        if (!window.OV) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/o3dv.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Wait a bit for the library to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        if (window.OV && viewerRef.current) {
          // Initialize the embedded viewer
          const viewer = new window.OV.EmbeddedViewer(viewerRef.current, {
            backgroundColor: new window.OV.RGBAColor(250, 250, 250, 1),
            defaultColor: new window.OV.RGBColor(200, 200, 200),
            edgeSettings: new window.OV.EdgeSettings(false, new window.OV.RGBColor(0, 0, 0), 1),
            environmentSettings: new window.OV.EnvironmentSettings([
              'envmaps/fishermans_bastion/posx.jpg',
              'envmaps/fishermans_bastion/negx.jpg',
              'envmaps/fishermans_bastion/posy.jpg',
              'envmaps/fishermans_bastion/negy.jpg',
              'envmaps/fishermans_bastion/posz.jpg',
              'envmaps/fishermans_bastion/negz.jpg'
            ], false)
          });

          viewerInstanceRef.current = viewer;

          // Load a default model to showcase the viewer
          viewer.LoadModelFromUrlList([
            'https://raw.githubusercontent.com/kovacsv/Online3DViewer/master/test/testfiles/obj/cube_with_materials.obj',
            'https://raw.githubusercontent.com/kovacsv/Online3DViewer/master/test/testfiles/obj/cube_with_materials.mtl'
          ]);
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
                <p>Loading viewer... Please wait or check console for errors.</p>
              </div>
            </div>
          `;
        }
      }
    };

    loadViewer();

    return () => {
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.Clear();
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
