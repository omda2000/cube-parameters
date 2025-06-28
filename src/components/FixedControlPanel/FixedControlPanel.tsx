
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
      className="fixed right-14 top-1/4 -translate-y-1/2 bg-white/95 backdrop-blur-sm border border-gray-300/50 rounded shadow-2xl z-40"
      style={{
        width: 240,
        height: 460,
        maxHeight: '85vh'
      }}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between p-1 border-b border-gray-300/50">
          <h3 className="text-xs font-medium text-gray-800">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-4 w-4 p-0 text-gray-600 hover:text-gray-800"
            >
              <X className="h-2 w-2" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: title ? 'calc(100% - 28px)' : '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default FixedControlPanel;
