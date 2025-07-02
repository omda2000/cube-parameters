
import React from 'react';
import { NotificationProvider } from '../contexts/NotificationContext';
import { SelectionProvider } from '../contexts/SelectionContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { UnitsProvider } from '../contexts/UnitsContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
      <UnitsProvider>
        <NotificationProvider>
          <SelectionProvider>
            {children}
          </SelectionProvider>
        </NotificationProvider>
      </UnitsProvider>
    </ThemeProvider>
  );
};
