
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';

interface BestPlayerToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const BestPlayerToggle = ({ checked, onCheckedChange }: BestPlayerToggleProps) => {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
      <Trophy className="h-4 w-4 text-yellow-500" />
      <div className="flex-1">
        <Label htmlFor="best-player-toggle" className="text-sm font-medium">
          Show Best Player
        </Label>
        <p className="text-xs text-muted-foreground">
          Display current best player stats
        </p>
      </div>
      <Switch
        id="best-player-toggle"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

export default BestPlayerToggle;
