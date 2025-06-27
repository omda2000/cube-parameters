
import React from 'react';
import { SelectionProvider } from '../../contexts/SelectionContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SelectionProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {children}
      </div>
    </SelectionProvider>
  );
};

export default MainLayout;
