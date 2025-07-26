import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import NotificationBell from '@/components/NotificationBell/NotificationBell';

export const SettingsTab: React.FC = () => {
  return (
    <>
      <RibbonGroup label="Notifications">
        <div className="flex items-center h-12">
          <NotificationBell />
        </div>
      </RibbonGroup>
    </>
  );
};