
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import NotificationBell from '../NotificationBell/NotificationBell';

interface AppHeaderProps {
  isMobile: boolean;
  mobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const AppHeader = ({ 
  isMobile, 
  mobileSheetOpen, 
  setMobileSheetOpen, 
  children 
}: AppHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            Architectural Model Viewer
          </h1>
          
          <div className="flex items-center gap-3">
            <NotificationBell />
            
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
  );
};

export default AppHeader;
