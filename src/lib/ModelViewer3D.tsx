import React from 'react';
import * as THREE from 'three';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UnitsProvider } from '@/contexts/UnitsContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import IndexContent from '@/components/IndexContent/IndexContent';
import type { LoadedModel } from '@/types/model';
import '@/index.css';

export interface ModelViewer3DProps {
  /** Custom class name for the container */
  className?: string;
  /** Container style overrides */
  style?: React.CSSProperties;
  /** Callback when files are uploaded */
  onFileUpload?: (file: File) => void;
  /** Callback when models change */
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  /** Callback when a point is created in the 3D scene */
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  /** Callback when a measurement is created */
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  /** Initial theme mode */
  defaultTheme?: 'light' | 'dark' | 'system';
  /** Whether to show debug information */
  debug?: boolean;
  /** Custom query client instance */
  queryClient?: QueryClient;
  /** Whether to disable keyboard shortcuts */
  disableKeyboardShortcuts?: boolean;
  /** Whether to show the control panels by default */
  showControlsInitially?: boolean;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  className = '',
  style,
  onFileUpload,
  onModelsChange,
  onPointCreate,
  onMeasureCreate,
  defaultTheme = 'system',
  debug = false,
  queryClient = defaultQueryClient,
  disableKeyboardShortcuts = false,
  showControlsInitially = true,
  ...props
}) => {
  React.useEffect(() => {
    if (debug) {
      console.log('ModelViewer3D: Component mounted with props:', {
        onFileUpload: !!onFileUpload,
        onModelsChange: !!onModelsChange,
        onPointCreate: !!onPointCreate,
        onMeasureCreate: !!onMeasureCreate,
        defaultTheme,
        disableKeyboardShortcuts,
        showControlsInitially
      });
    }
  }, [debug, onFileUpload, onModelsChange, onPointCreate, onMeasureCreate, defaultTheme, disableKeyboardShortcuts, showControlsInitially]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UnitsProvider>
          <NotificationProvider>
            <TooltipProvider>
              <div 
                className={`relative w-full h-full ${className}`}
                style={style}
                {...props}
              >
                <IndexContent />
                <Toaster />
                <Sonner />
              </div>
            </TooltipProvider>
          </NotificationProvider>
        </UnitsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ModelViewer3D;