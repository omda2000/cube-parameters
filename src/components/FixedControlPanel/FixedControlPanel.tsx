
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FixedControlPanelProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

const FixedControlPanel = ({
  title,
  children,
  isOpen,
  onClose
}: FixedControlPanelProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed left-20 top-20 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl z-40"
      style={{
        width: 300,
        height: 480,
        maxHeight: '85vh'
      }}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: title ? 'calc(100% - 60px)' : '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default FixedControlPanel;
