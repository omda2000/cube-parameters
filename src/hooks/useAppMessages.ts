
import { useMessages } from '@/contexts/MessageContext';
import { useCallback } from 'react';

export const useAppMessages = () => {
  const { addMessage } = useMessages();

  const showMessage = useCallback((
    title: string,
    description?: string,
    variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default'
  ) => {
    addMessage({ title, description, variant });
  }, [addMessage]);

  const showSuccess = useCallback((title: string, description?: string) => {
    showMessage(title, description, 'success');
  }, [showMessage]);

  const showError = useCallback((title: string, description?: string) => {
    showMessage(title, description, 'destructive');
  }, [showMessage]);

  const showWarning = useCallback((title: string, description?: string) => {
    showMessage(title, description, 'warning');
  }, [showMessage]);

  const showInfo = useCallback((title: string, description?: string) => {
    showMessage(title, description, 'info');
  }, [showMessage]);

  return {
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
