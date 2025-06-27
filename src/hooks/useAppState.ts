
import { useState } from 'react';
import * as THREE from 'three';

export const useAppState = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showMeasurePanel, setShowMeasurePanel] = useState(false);
  const [activeControlTab, setActiveControlTab] = useState('scene');
  const [activeTool, setActiveTool] = useState<'select' | 'point' | 'measure' | 'move'>('select');
  const [isOrthographic, setIsOrthographic] = useState(false);

  return {
    scene,
    setScene,
    showControlPanel,
    setShowControlPanel,
    showMeasurePanel,
    setShowMeasurePanel,
    activeControlTab,
    setActiveControlTab,
    activeTool,
    setActiveTool,
    isOrthographic,
    setIsOrthographic
  };
};
