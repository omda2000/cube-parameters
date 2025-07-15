
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
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 relative z-40">
      <div className="flex items-center justify-between">
        {/* Mobile Menu */}
        {isMobile && (
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-slate-200 hover:bg-slate-700">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-slate-800 border-slate-700 p-0">
              {children}
            </SheetContent>
          </Sheet>
        )}

        {/* Spacer for mobile menu alignment */}
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default AppHeader;
