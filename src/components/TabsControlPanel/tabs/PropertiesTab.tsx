
import { Box, Palette, Tag, Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import type { BoxDimensions } from '../../../types/model';

interface PropertiesTabProps {
  dimensions: BoxDimensions;
  setDimensions: (dimensions: BoxDimensions) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
}

const PropertiesTab = ({
  dimensions,
  setDimensions,
  boxColor,
  setBoxColor,
  objectName,
  setObjectName
}: PropertiesTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2">
          <Box className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Properties</span>
        </div>

        {/* Object name */}
        <div className="space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Name</Label>
                </div>
                <Input
                  value={objectName}
                  onChange={(e) => setObjectName(e.target.value)}
                  className="h-6 text-xs"
                  placeholder="Object name"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Object Name</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Color picker */}
        <div className="space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Palette className="h-3 w-3 text-pink-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Color</Label>
                </div>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="w-8 h-6 rounded border border-slate-600 bg-transparent"
                  />
                  <Input
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="h-6 text-xs flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Material Color</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="bg-slate-600" />

        {/* Dimensions */}
        <div className="space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Ruler className="h-3 w-3 text-cyan-400" />
                  <Label className="text-xs text-slate-700 dark:text-slate-300">Dimensions</Label>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <Input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 1 })}
                    className="h-6 text-xs"
                    placeholder="L"
                  />
                  <Input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 1 })}
                    className="h-6 text-xs"
                    placeholder="W"
                  />
                  <Input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 1 })}
                    className="h-6 text-xs"
                    placeholder="H"
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Object Dimensions (L, W, H)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PropertiesTab;
