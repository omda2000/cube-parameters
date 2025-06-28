
import React, { useState } from 'react';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:text-slate-200 hover:bg-slate-700/50 border-slate-500"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-slate-600 flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">Notifications</h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllMessages}
                className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-slate-400">
                No notifications yet
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-700/50 ${
                    !message.read ? 'bg-slate-700/30' : ''
                  }`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{getMessageIcon(message.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-100 text-sm truncate">
                          {message.title}
                        </h4>
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      {message.description && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {message.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
