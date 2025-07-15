
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Camera } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import NotificationBell from '../NotificationBell/NotificationBell';

interface AppHeaderProps {
  isMobile: boolean;
  mobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;
  children: React.ReactNode;
  isOrthographic?: boolean;
  onCameraToggle?: (orthographic: boolean) => void;
}

const AppHeader = ({ 
  isMobile, 
  mobileSheetOpen, 
  setMobileSheetOpen, 
  children,
  isOrthographic = false,
  onCameraToggle
}: AppHeaderProps) => {
  const handleCameraToggle = (checked: boolean) => {
    onCameraToggle?.(checked);
    // Call the global camera switch function
    const switchCamera = (window as any).__switchCameraMode;
    if (switchCamera) {
      switchCamera(checked);
    }
  };

  return (
    <TooltipProvider>
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Consolidated header - title removed per user request */}
            
            <div className="flex items-center gap-3">
              <NotificationBell />
              
              {onCameraToggle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 rounded px-3 py-1.5 transition-colors">
                      <Camera className="h-4 w-4 text-slate-200" />
                      <span className="text-xs text-slate-200">Ortho</span>
                      <Switch
                        checked={isOrthographic}
                        onCheckedChange={handleCameraToggle}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Camera Type (O)</p>
                  </TooltipContent>
                </Tooltip>
              )}
            
            {isMobile && (
              <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="text-slate-200 border-slate-500 bg-slate-700/50 hover:bg-slate-600">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-slate-800 border-slate-600 overflow-y-auto">
                  <div className="p-4">
                    {children}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AppHeader;
