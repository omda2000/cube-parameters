import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPanel = () => {
  const { messages, unreadCount, markAsRead, markAllAsRead, clearAllMessages } = useNotifications();

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllMessages}
            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Clear all notifications"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                !message.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(message.id)}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm">{getMessageIcon(message.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {message.title}
                    </h4>
                    {!message.read && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  {message.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {message.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;