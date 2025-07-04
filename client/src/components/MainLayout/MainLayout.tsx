
import React from 'react';
import { SelectionProvider } from '../../contexts/SelectionContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SelectionProvider>
      <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors">
        {children}
      </div>
    </SelectionProvider>
  );
};

export default MainLayout;
