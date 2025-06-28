
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, CircleCheck, CircleX, Info, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  timestamp: Date;
}

interface MessagePanelProps {
  messages?: Message[];
  onClearAll?: () => void;
  onRemoveMessage?: (id: string) => void;
}

const MessagePanel = ({ 
  messages = [], 
  onClearAll = () => {}, 
  onRemoveMessage = () => {} 
}: MessagePanelProps) => {
  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <CircleCheck className="h-3 w-3 text-green-600" />;
      case 'destructive':
        return <CircleX className="h-3 w-3 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
      case 'info':
        return <Info className="h-3 w-3 text-blue-600" />;
      default:
        return <Info className="h-3 w-3 text-gray-600" />;
    }
  };

  const getVariantColor = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'destructive':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800">Messages</h3>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-6 px-2 text-xs text-gray-600 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[380px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">No messages yet</div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded border ${getVariantColor(message.variant)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getIcon(message.variant)}
                    <div className="flex-1 min-w-0">
                      {message.title && (
                        <div className="text-xs font-medium text-gray-800 mb-1">
                          {message.title}
                        </div>
                      )}
                      {message.description && (
                        <div className="text-xs text-gray-600">
                          {message.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMessage(message.id)}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-red-600 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MessagePanel;
