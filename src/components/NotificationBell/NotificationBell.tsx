
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBellProps {
  onPanelOpen?: () => void;
}

const NotificationBell = ({ onPanelOpen }: NotificationBellProps) => {
  const { unreadCount } = useNotifications();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onPanelOpen}
      className="relative text-white hover:text-slate-200 hover:bg-slate-700/50 border-slate-500 h-8 w-8 p-0"
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default NotificationBell;
