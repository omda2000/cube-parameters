
import { useEffect } from 'react';

declare global {
  interface Window {
    OV?: any;
  }
}

const FullOnline3DViewer = () => {
  useEffect(() => {
    const loadViewer = async () => {
      try {
        // Load CSS files
        const cssFiles = ['/o3dv.css', '/website.css', '/themes.css'];
        for (const cssFile of cssFiles) {
          if (!document.querySelector(`link[href="${cssFile}"]`)) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = cssFile;
            document.head.appendChild(cssLink);
          }
        }

        // Load JS if not already loaded
        if (!window.OV) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/o3dv.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Wait for library to initialize
        await new Promise(resolve => setTimeout(resolve, 200));

        if (window.OV) {
          // Create the complete website structure
          const websiteDiv = document.getElementById('website_root');
          if (websiteDiv) {
            websiteDiv.innerHTML = `
              <div id="header" class="ov_header">
                <div class="ov_header_left">
                  <div class="ov_header_button" id="header_logo">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEuNSA0LjV2OC4xbDcgNC4xIDctNC4xVjQuNWwtNy00em03IDEyLjJWOC41bS03LTQgNyA0bTAgMCA3LTQiLz48L3N2Zz4=" alt="Online 3D Viewer" />
                    <div class="ov_header_title">Online 3D Viewer</div>
                  </div>
                </div>
                <div class="ov_header_right">
                  <div class="ov_header_button" id="header_open_file" title="Open File">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEzLjUgOS41djFNMiAxNWwzLjYtMy44Yy40LS40IDEuMi0uNyAxLjctLjdoOS4xYy41IDAgLjkuMy41LjdsLTMuNiAzLjZjLS40LjQtMS4xLjctMS42LjdIMi41Yy0uNSAwLTEtLjQtMS0xdi0xMGMwLS41LjQtMSAxLTFoMS45Yy41IDAgMS4zLjMgMS42LjdMNy42IDZjLjQuNCAxLjEuNSAxLjYuNWguOG0xLjUtMyAzLTMgMyAzbS0zIC41Vi41Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEwIDguNWMyLjUgMCA0LjUtMiA0LjUtNC41Ii8+PC9zdmc+" alt="Open" />
                  </div>
                  <div class="ov_header_button" id="header_settings" title="Settings">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjIuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0eWxlPSJwYWludC1vcmRlcjpub3JtYWwiLz48L3N2Zz4=" alt="Settings" />
                  </div>
                </div>
              </div>
              <div id="main">
                <div id="navigator" class="ov_panel ov_panel_left">
                  <div id="navigator_header" class="ov_panel_header">
                    <div class="ov_panel_title">Navigator</div>
                  </div>
                  <div id="navigator_content" class="ov_panel_content">
                    <div id="navigator_tree"></div>
                  </div>
                </div>
                <div id="viewer_content">
                  <div id="toolbar" class="ov_toolbar">
                    <div class="ov_toolbar_button" id="toolbar_open_file" title="Open File">
                      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEzLjUgOS41djFNMiAxNWwzLjYtMy44Yy40LS40IDEuMi0uNyAxLjctLjdoOS4xYy41IDAgLjkuMy41LjdsLTMuNiAzLjZjLS40LjQtMS4xLjctMS42LjdIMi41Yy0uNSAwLTEtLjQtMS0xdi0xMGMwLS41LjQtMSAxLTFoMS45Yy41IDAgMS4zLjMgMS42LjdMNy42IDZjLjQuNCAxLjEuNSAxLjYuNWguOG0xLjUtMyAzLTMgMyAzbS0zIC41Vi41Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEwIDguNWMyLjUgMCA0LjUtMiA0LjUtNC41Ii8+PC9zdmc+" alt="Open" />
                    </div>
                    <div class="ov_toolbar_separator"></div>
                    <div class="ov_toolbar_button" id="toolbar_fit" title="Fit to Window">
                      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEuNSA1LjV2LTRoNG0xMSA0di00aC00bS0xMSAxMXY0aDRtMTEtNHY0aC00bS0xMS0xNUw2IDZtMTAuNS00LjVMMTIgNk0xLjUgMTYuNSA2IDEybTEwLjUgNC41TDEyIDEyIi8+PC9zdmc+" alt="Fit" />
                    </div>
                    <div class="ov_toolbar_button" id="toolbar_flip" title="Flip Y-Z">
                      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTUuNSAyLjR2MTQuMW0tMy0xMiAzLTNtMyAzLTMtM203IDE0LjFWMS41bS0zIDEyIDMgM20zLTMtMyAzIi8+PC9zdmc+" alt="Flip" />
                    </div>
                    <div class="ov_toolbar_separator"></div>
                    <div class="ov_toolbar_button" id="toolbar_meshes" title="Show/Hide Meshes">
                      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSI0LjAwMiIgZD0iTTEuNSA0Ljh2OC41bDcgNC4yIDctNC4yVjQuOEw4LjUuNXptNyA0LjJ2OC41Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjYzMjM4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSI0LjAwMiIgZD0ibTEuNSA0LjggNyA0LjIgNy00LjIiLz48L3N2Zz4=" alt="Meshes" />
                    </div>
                  </div>
                  <div id="viewer" class="ov_viewer"></div>
                </div>
                <div id="sidebar" class="ov_panel ov_panel_right">
                  <div id="sidebar_header" class="ov_panel_header">
                    <div class="ov_panel_title">Details</div>
                  </div>
                  <div id="sidebar_content" class="ov_panel_content">
                    <div id="sidebar_details"></div>
                  </div>
                </div>
              </div>
            `;

            // Initialize the full website
            window.OV.StartWebsite();
          }
        }
      } catch (error) {
        console.error('Failed to load Online 3D Viewer:', error);
        const fallbackDiv = document.getElementById('website_root');
        if (fallbackDiv) {
          fallbackDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb;">
              <div style="text-align: center; color: #6b7280;">
                <div style="font-size: 48px; margin-bottom: 1rem;">⚠️</div>
                <h3>Failed to load Online 3D Viewer</h3>
                <p>Please check console for errors.</p>
              </div>
            </div>
          `;
        }
      }
    };

    loadViewer();
  }, []);

  return <div id="website_root" className="h-screen w-full" />;
};

export default FullOnline3DViewer;
