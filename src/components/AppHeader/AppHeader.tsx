
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
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Architectural Model Viewer
      </h1>
      
      <div className="flex items-center gap-3">
        <NotificationBell />
        
        {isMobile && (
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-slate-700 border-slate-300">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white border-slate-200 overflow-y-auto">
              <div className="p-4">
                {children}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
