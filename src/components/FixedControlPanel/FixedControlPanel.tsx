
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
      className="fixed right-10 top-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg z-40"
      style={{
        width: 280,
        height: 520,
        maxHeight: '85vh'
      }}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-900">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-5 w-5 p-0 text-gray-500 hover:text-gray-900"
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: title ? 'calc(100% - 45px)' : '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default FixedControlPanel;
