
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    OV?: any;
  }
}

const FullOnline3DViewer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadViewer = async () => {
      try {
        console.log('Starting to load Online 3D Viewer...');
        
        // Load CSS files first
        const cssFiles = [
          { href: '/o3dv.css', id: 'o3dv-css' },
          { href: '/website.css', id: 'website-css' },
          { href: '/themes.css', id: 'themes-css' }
        ];
        
        for (const cssFile of cssFiles) {
          if (!document.querySelector(`#${cssFile.id}`)) {
            console.log(`Loading CSS: ${cssFile.href}`);
            const cssLink = document.createElement('link');
            cssLink.id = cssFile.id;
            cssLink.rel = 'stylesheet';
            cssLink.href = cssFile.href;
            document.head.appendChild(cssLink);
            
            // Wait for CSS to load
            await new Promise<void>((resolve, reject) => {
              cssLink.onload = () => {
                console.log(`CSS loaded: ${cssFile.href}`);
                resolve();
              };
              cssLink.onerror = () => {
                console.warn(`Failed to load CSS: ${cssFile.href}`);
                resolve(); // Continue even if CSS fails
              };
            });
          }
        }

        // Load main JS library
        if (!window.OV) {
          console.log('Loading o3dv.js...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/o3dv.js';
            script.onload = () => {
              console.log('o3dv.js loaded successfully');
              resolve();
            };
            script.onerror = (e) => {
              console.error('Failed to load o3dv.js:', e);
              reject(new Error('Failed to load o3dv.js'));
            };
            document.head.appendChild(script);
          });
        }

        // Load website JS
        if (!document.querySelector('#website-js')) {
          console.log('Loading website.js...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.id = 'website-js';
            script.src = '/website.js';
            script.onload = () => {
              console.log('website.js loaded successfully');
              resolve();
            };
            script.onerror = (e) => {
              console.warn('Failed to load website.js:', e);
              resolve(); // Continue even if website.js fails
            };
            document.head.appendChild(script);
          });
        }

        // Wait for library to be fully available
        let attempts = 0;
        while (!window.OV && attempts < 100) {
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }

        if (!window.OV) {
          throw new Error('Online 3D Viewer library not available after loading');
        }

        console.log('OV library is available:', window.OV);

        // Initialize the viewer
        const viewerContainer = document.getElementById('viewer-container');
        if (viewerContainer) {
          // Clear any existing content
          viewerContainer.innerHTML = '';
          
          // Try embedded viewer approach first
          if (window.OV.EmbeddedViewer) {
            console.log('Initializing embedded viewer...');
            
            const viewer = new window.OV.EmbeddedViewer(viewerContainer, {
              backgroundColor: new window.OV.RGBAColor(255, 255, 255, 255),
              defaultColor: new window.OV.RGBColor(200, 200, 200),
              edgeSettings: new window.OV.EdgeSettings(false, new window.OV.RGBColor(0, 0, 0), 1)
            });
            
            console.log('Viewer initialized successfully');
            setLoading(false);
            
            // Try to load a sample model
            viewer.LoadModelFromUrlList(['/assets/models/cube.obj']).then(() => {
              console.log('Sample model loaded successfully');
            }).catch((err: any) => {
              console.log('Sample model loading failed (this is okay):', err);
            });
            
          } else if (window.OV.Init3DViewerFromUrlList) {
            console.log('Using Init3DViewerFromUrlList...');
            
            window.OV.Init3DViewerFromUrlList ('viewer-container', []).then(() => {
              console.log('3D Viewer initialized successfully');
              setLoading(false);
            }).catch((err: any) => {
              console.error('Failed to initialize 3D viewer:', err);
              throw new Error('Failed to initialize 3D viewer');
            });
            
          } else {
            // Manual initialization
            console.log('Manual viewer initialization...');
            viewerContainer.innerHTML = `
              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f5f5f5; color: #666; font-family: Arial, sans-serif;">
                <div style="text-align: center;">
                  <h3>Online 3D Viewer</h3>
                  <p>Drag and drop 3D files here to view them</p>
                  <div style="margin-top: 20px;">
                    <input type="file" id="file-input" accept=".obj,.stl,.ply,.off,.3ds,.wrl,.dae,.fbx,.gltf,.glb" multiple style="display: none;" />
                    <button onclick="document.getElementById('file-input').click()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                      Select Files
                    </button>
                  </div>
                </div>
              </div>
            `;
            setLoading(false);
          }
        }
        
      } catch (error) {
        console.error('Failed to load Online 3D Viewer:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    loadViewer();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Online 3D Viewer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load Viewer</h3>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div id="viewer-container" className="w-full h-full" />
    </div>
  );
};

export default FullOnline3DViewer;
