import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { RibbonButton } from '../RibbonButton';
import { MousePointer, Plus } from 'lucide-react';

interface HomeTabProps {
  activeTool: 'select' | 'point' | 'measure' | 'move';
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ activeTool, onToolSelect }) => {
  return (
    <>
      <RibbonGroup label="Selection">
        <RibbonButton
          icon={MousePointer}
          label="Select"
          size="large"
          active={activeTool === 'select'}
          onClick={() => onToolSelect('select')}
          tooltip="Select objects (S)"
        />
        <RibbonButton
          icon={Plus}
          label="Point"
          size="large"
          active={activeTool === 'point'}
          onClick={() => onToolSelect('point')}
          tooltip="Add points (P)"
        />
      </RibbonGroup>
    </>
  );
};