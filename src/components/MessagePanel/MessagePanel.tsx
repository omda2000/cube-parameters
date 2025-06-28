
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, CircleCheck, CircleX, Info, AlertTriangle, X } from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';

const MessagePanel = () => {
  const { messages, removeMessage, clearAllMessages } = useMessages();

  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <CircleCheck className="h-4 w-4 text-green-600" />;
      case 'destructive':
        return <CircleX className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800">Messages</h3>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllMessages}
            className="h-8 px-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-sm">No messages yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border ${getVariantColor(message.variant)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getIcon(message.variant)}
                    <div className="flex-1 min-w-0">
                      {message.title && (
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {message.title}
                        </div>
                      )}
                      {message.description && (
                        <div className="text-sm text-gray-600">
                          {message.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMessage(message.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
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
