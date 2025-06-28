
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AppMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  messages: AppMessage[];
  unreadCount: number;
  addMessage: (message: Omit<AppMessage, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllMessages: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AppMessage[]>([]);

  const addMessage = (message: Omit<AppMessage, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: AppMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <NotificationContext.Provider value={{
      messages,
      unreadCount,
      addMessage,
      markAsRead,
      markAllAsRead,
      clearAllMessages,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
