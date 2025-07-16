import React, { useEffect, useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UnitsProvider } from '@/contexts/UnitsContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import MainLayout from '@/components/MainLayout/MainLayout';
import ModelViewerContainerWrapper from '@/containers/ModelViewerContainer';
import UIContainer from '@/containers/UIContainer';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { ModelViewer3DProps } from './types/package';
import '@/index.css';

// Create a single query client instance for the package
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  width = '100%',
  height = '600px',
  className = '',
  style = {},
  theme = 'dark',
  showToolbar = true,
  showControlPanel = true,
  showMeasurePanel = true,
  lightingConfig,
  cameraConfig,
  toolsConfig,
  themeConfig,
  onModelLoad,
  onModelError,
  onMeasurement,
  onPointCreate,
  onMeasureCreate,
  onSceneReady,
  onToolChange,
  onViewChange,
  onZoom,
  initialModel,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle initial model loading
  useEffect(() => {
    if (initialModel && typeof initialModel === 'string') {
      // Load model from URL
      fetch(initialModel)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'model.glb', { type: 'model/gltf-binary' });
          // Trigger file upload through the viewer
          const event = new CustomEvent('loadInitialModel', { detail: { file } });
          window.dispatchEvent(event);
        })
        .catch(error => {
          console.error('Failed to load initial model:', error);
          onModelError?.(error);
        });
    } else if (initialModel instanceof File) {
      // Load file directly
      const event = new CustomEvent('loadInitialModel', { detail: { file: initialModel } });
      window.dispatchEvent(event);
    }
  }, [initialModel, onModelError]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const containerClasses = `model-viewer-3d ${className}`;

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={containerStyle}
      {...props}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme={theme}>
          <UnitsProvider>
            <NotificationProvider>
              <TooltipProvider>
                <ErrorBoundary
                  fallback={
                    <div className="flex items-center justify-center h-full bg-background text-foreground">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Model Viewer Error</h3>
                        <p className="text-sm text-muted-foreground">
                          Something went wrong while loading the 3D viewer.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <MainLayout>
                    <div className="relative w-full h-full">
                      {/* 3D Viewer */}
                      <ErrorBoundary
                        fallback={
                          <div className="flex items-center justify-center h-full bg-muted">
                            <p className="text-muted-foreground">Failed to load 3D viewer</p>
                          </div>
                        }
                      >
                        <ModelViewerContainerWrapper 
                          onPointCreate={onPointCreate}
                          onMeasureCreate={onMeasureCreate}
                        />
                      </ErrorBoundary>

                      {/* UI Controls */}
                      {(showToolbar || showControlPanel) && (
                        <ErrorBoundary
                          fallback={
                            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-2">
                              <p className="text-xs text-muted-foreground">UI controls unavailable</p>
                            </div>
                          }
                        >
                          <UIContainer />
                        </ErrorBoundary>
                      )}
                    </div>
                  </MainLayout>
                </ErrorBoundary>
                
                {/* Notifications */}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </NotificationProvider>
          </UnitsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
};

export default ModelViewer3D;