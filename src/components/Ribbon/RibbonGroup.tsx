import React from 'react';
import { cn } from '@/lib/utils';

interface RibbonGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const RibbonGroup: React.FC<RibbonGroupProps> = ({ 
  label, 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center gap-2 px-3 py-1 border-r border-border/50 last:border-r-0",
      className
    )}>
      <div className="flex items-center gap-2 min-h-[48px]">
        {children}
      </div>
      <span className="text-xs text-muted-foreground font-medium">
        {label}
      </span>
    </div>
  );
};