
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Box, Grid3X3 } from 'lucide-react';

interface CameraTypeToggleProps {
  isOrthographic: boolean;
  onToggle: (isOrthographic: boolean) => void;
}

const CameraTypeToggle = ({ isOrthographic, onToggle }: CameraTypeToggleProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isOrthographic ? "default" : "ghost"}
          size="sm"
          onClick={() => onToggle(!isOrthographic)}
          className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
        >
          {isOrthographic ? <Grid3X3 className="h-3 w-3" /> : <Box className="h-3 w-3" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isOrthographic ? 'Switch to Perspective (O)' : 'Switch to Orthographic (O)'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CameraTypeToggle;
