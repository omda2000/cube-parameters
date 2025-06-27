
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Settings } from 'lucide-react';

interface AppHeaderProps {
  isMobile: boolean;
  mobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

const AppHeader = ({ 
  isMobile, 
  mobileSheetOpen, 
  setMobileSheetOpen, 
  children,
  onSettingsClick 
}: AppHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
          Architectural Model Viewer
        </h1>
        
        <div className="flex items-center gap-2">
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          
          {isMobile && (
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-slate-800/95 border-slate-700/50 overflow-y-auto">
                <div className="p-4">
                  {children}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
