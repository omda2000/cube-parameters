
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
        const cssFiles = ['/o3dv.css', '/website.css', '/themes.css'];
        for (const cssFile of cssFiles) {
          if (!document.querySelector(`link[href="${cssFile}"]`)) {
            console.log(`Loading CSS: ${cssFile}`);
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = cssFile;
            cssLink.onload = () => console.log(`CSS loaded: ${cssFile}`);
            cssLink.onerror = () => console.error(`Failed to load CSS: ${cssFile}`);
            document.head.appendChild(cssLink);
          }
        }

        // Load main JS library
        if (!window.OV) {
          console.log('Loading o3dv.js...');
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/o3dv.js';
            script.onload = () => {
              console.log('o3dv.js loaded successfully');
              resolve(void 0);
            };
            script.onerror = (e) => {
              console.error('Failed to load o3dv.js:', e);
              reject(new Error('Failed to load o3dv.js'));
            };
            document.head.appendChild(script);
          });
        }

        // Wait for library to be fully available
        let attempts = 0;
        while (!window.OV && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.OV) {
          throw new Error('Online 3D Viewer library not available after loading');
        }

        console.log('OV library is available:', window.OV);

        // Initialize the viewer
        const websiteDiv = document.getElementById('website_root');
        if (websiteDiv) {
          // Create a simple viewer container instead of full website
          websiteDiv.innerHTML = `
            <div id="main" style="width: 100%; height: 100vh; display: flex;">
              <div id="navigator" style="width: 300px; background: #f5f5f5; border-right: 1px solid #ddd;">
                <div style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Navigator</div>
                <div id="navigator_content" style="padding: 10px;">
                  <div id="navigator_tree"></div>
                </div>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column;">
                <div id="toolbar" style="height: 50px; background: #f9f9f9; border-bottom: 1px solid #ddd; display: flex; align-items: center; padding: 0 10px;">
                  <button id="header_open_file" style="margin-right: 10px; padding: 5px 10px;">Open File</button>
                  <button id="toolbar_fit" style="margin-right: 10px; padding: 5px 10px;">Fit</button>
                  <button id="toolbar_flip" style="margin-right: 10px; padding: 5px 10px;">Flip Y-Z</button>
                </div>
                <div id="viewer" style="flex: 1; background: #fff;"></div>
              </div>
              <div id="sidebar" style="width: 300px; background: #f5f5f5; border-left: 1px solid #ddd;">
                <div style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Details</div>
                <div id="sidebar_content" style="padding: 10px;">
                  <div id="sidebar_details"></div>
                </div>
              </div>
            </div>
          `;

          // Initialize the viewer with a simple setup
          if (window.OV.Init3DViewerFromUrlList) {
            console.log('Initializing 3D viewer...');
            
            // Create viewer element
            const viewerElement = document.getElementById('viewer');
            if (viewerElement) {
              // Try to initialize the viewer
              const viewer = new window.OV.EmbeddedViewer(viewerElement, {
                backgroundColor: [255, 255, 255],
                defaultColor: [200, 200, 200],
                edgeSettings: {
                  showEdges: false,
                  edgeColor: [0, 0, 0],
                  edgeThreshold: 1
                }
              });
              
              // Load a sample model if available
              const sampleModel = '/assets/models/cube.obj';
              viewer.LoadModelFromUrlList([sampleModel]).then(() => {
                console.log('Sample model loaded successfully');
                setLoading(false);
              }).catch((err: any) => {
                console.log('Could not load sample model, but viewer is ready:', err);
                setLoading(false);
              });
            }
          } else {
            console.log('EmbeddedViewer not available, viewer is ready for file upload');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to load Online 3D Viewer:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setLoading(false);
        
        // Show fallback UI
        const fallbackDiv = document.getElementById('website_root');
        if (fallbackDiv) {
          fallbackDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; flex-direction: column;">
              <div style="text-align: center; color: #6b7280; max-width: 500px;">
                <div style="font-size: 48px; margin-bottom: 1rem;">⚠️</div>
                <h3 style="margin-bottom: 1rem;">Failed to load Online 3D Viewer</h3>
                <p style="margin-bottom: 1rem;">The 3D viewer could not be initialized. This might be due to:</p>
                <ul style="text-align: left; margin-bottom: 1rem;">
                  <li>Missing or corrupted library files</li>
                  <li>Network connectivity issues</li>
                  <li>Browser compatibility problems</li>
                </ul>
                <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
                <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Retry
                </button>
              </div>
            </div>
          `;
        }
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

  return <div id="website_root" className="h-screen w-full" />;
};

export default FullOnline3DViewer;
