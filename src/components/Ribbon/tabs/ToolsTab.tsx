import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { RibbonButton } from '../RibbonButton';
import { Ruler } from 'lucide-react';

interface ToolsTabProps {
  activeTool: 'select' | 'point' | 'measure' | 'move';
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({ activeTool, onToolSelect }) => {
  return (
    <>
      <RibbonGroup label="Measurement">
        <RibbonButton
          icon={Ruler}
          label="Measure"
          size="large"
          active={activeTool === 'measure'}
          onClick={() => onToolSelect('measure')}
          tooltip="Measure distances (M)"
        />
      </RibbonGroup>
    </>
  );
};