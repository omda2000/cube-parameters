import React from 'react';
import { TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface RibbonTabListProps {
  children: React.ReactNode;
  className?: string;
}

export const RibbonTabList: React.FC<RibbonTabListProps> = ({ children, className }) => {
  return (
    <TabsList className={cn(
      "h-8 bg-transparent p-0 border-b border-border rounded-none w-full justify-start",
      className
    )}>
      {children}
    </TabsList>
  );
};

interface RibbonTabTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const RibbonTabTrigger: React.FC<RibbonTabTriggerProps> = ({ 
  value, 
  children, 
  className 
}) => {
  return (
    <TabsTrigger 
      value={value}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-none border-b-2 border-transparent",
        "data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:shadow-sm",
        "hover:bg-muted/50 transition-colors",
        className
      )}
    >
      {children}
    </TabsTrigger>
  );
};

interface RibbonTabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const RibbonTabContent: React.FC<RibbonTabContentProps> = ({ 
  value, 
  children, 
  className 
}) => {
  return (
    <TabsContent 
      value={value}
      className={cn(
        "mt-0 p-4 bg-background min-h-[80px] flex items-center gap-4",
        className
      )}
    >
      {children}
    </TabsContent>
  );
};