
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FixedControlPanelProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

const FixedControlPanel = ({
  title,
  children,
  isOpen,
  onClose,
  className
}: FixedControlPanelProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed left-14 top-12 bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-40",
        "w-72 h-[480px] max-h-[82vh]", // Reduced width from 320px to 288px
        className
      )}
    >
      {/* Compact Header */}
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
          <h3 className="text-xs font-semibold text-card-foreground">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Compact Content */}
      <div className="overflow-y-auto px-1" style={{ height: title ? 'calc(100% - 44px)' : '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default FixedControlPanel;
