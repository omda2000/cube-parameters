import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface RibbonContainerProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

export const RibbonContainer: React.FC<RibbonContainerProps> = ({
  children,
  defaultTab = "home",
  className
}) => {
  return (
    <div className={cn(
      "w-full bg-gradient-to-b from-muted/30 to-card border-b border-border",
      className
    )}>
      <Tabs defaultValue={defaultTab} className="w-full">
        {children}
      </Tabs>
    </div>
  );
};