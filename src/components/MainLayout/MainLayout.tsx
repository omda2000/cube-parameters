
import React from 'react';
import { SelectionProvider } from '../../contexts/SelectionContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SelectionProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-900 overflow-hidden">
        {children}
      </div>
    </SelectionProvider>
  );
};

export default MainLayout;
