import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface RibbonButtonProps {
  icon: LucideIcon;
  label?: string;
  size: 'large' | 'medium' | 'small';
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}

export const RibbonButton: React.FC<RibbonButtonProps> = ({
  icon: Icon,
  label,
  size,
  onClick,
  active = false,
  disabled = false,
  tooltip,
  className
}) => {
  const buttonContent = () => {
    switch (size) {
      case 'large':
        return (
          <div className="flex flex-col items-center gap-1 px-3 py-2">
            <Icon size={20} />
            {label && <span className="text-xs font-medium">{label}</span>}
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon size={16} />
            {label && <span className="text-xs">{label}</span>}
          </div>
        );
      case 'small':
        return (
          <div className="p-1">
            <Icon size={14} />
          </div>
        );
    }
  };

  const buttonClasses = cn(
    "h-auto transition-all duration-200",
    {
      'min-h-[48px]': size === 'large',
      'h-8': size === 'medium',
      'h-6 w-6': size === 'small',
    },
    {
      'bg-primary/20 border-primary/50': active,
      'hover:bg-primary/10': !active,
    },
    className
  );

  const button = (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {buttonContent()}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};