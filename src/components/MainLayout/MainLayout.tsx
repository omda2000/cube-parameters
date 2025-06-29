
import React from 'react';
import { SelectionProvider } from '../../contexts/SelectionContext';
import { AppStateProvider } from '../../store/AppStateContext';
import { SceneStateProvider } from '../../store/SceneStateContext';
import { UIStateProvider } from '../../store/UIStateContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AppStateProvider>
      <SceneStateProvider>
        <UIStateProvider>
          <SelectionProvider>
            <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors">
              {children}
            </div>
          </SelectionProvider>
        </UIStateProvider>
      </SceneStateProvider>
    </AppStateProvider>
  );
};

export default MainLayout;
