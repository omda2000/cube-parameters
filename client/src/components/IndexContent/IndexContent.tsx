import React from 'react';
import ModelViewerContainer from '@/containers/ModelViewerContainer';
import UIContainer from '@/containers/UIContainer';
import { SelectionProvider } from '@/contexts/SelectionContext';
import ErrorBoundary from '@/components/ErrorBoundary';

const IndexContent = () => {
  return (
    <ErrorBoundary>
      <SelectionProvider>
        <div className="h-screen flex">
          <UIContainer />
          <ModelViewerContainer />
        </div>
      </SelectionProvider>
    </ErrorBoundary>
  );
};

export default IndexContent;