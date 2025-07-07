
export const getCursorForTool = (activeTool: 'select' | 'point' | 'measure' | 'move'): string => {
  const cursors = {
    point: 'crosshair',
    measure: 'crosshair',
    move: 'move',
    select: 'default'
  };
  return cursors[activeTool];
};

export const setCursor = (renderer: THREE.WebGLRenderer, cursor: string) => {
  renderer.domElement.style.cursor = cursor;
};
