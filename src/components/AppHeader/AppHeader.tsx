
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
        Architectural Model Viewer
      </h1>
      
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
  );
};

export default AppHeader;
