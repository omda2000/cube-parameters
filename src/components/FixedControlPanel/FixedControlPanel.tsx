
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
      className="fixed right-14 top-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl z-40"
      style={{
        width: 280,
        height: 480,
        maxHeight: '85vh'
      }}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: title ? 'calc(100% - 56px)' : '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default FixedControlPanel;
