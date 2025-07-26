import React from 'react';
import { cn } from '@/lib/utils';

interface RibbonSeparatorProps {
  className?: string;
}

export const RibbonSeparator: React.FC<RibbonSeparatorProps> = ({ className }) => {
  return (
    <div className={cn(
      "w-px h-8 bg-border/50 mx-2",
      className
    )} />
  );
};