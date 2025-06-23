
import ThreeViewer from './ThreeViewer';

interface BoxViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  showShadow: boolean;
  showEdges: boolean;
  boxColor: string;
  objectName: string;
  transformMode: 'translate' | 'rotate' | 'scale';
}

const BoxViewer = ({ dimensions, showShadow, showEdges, boxColor, objectName, transformMode }: BoxViewerProps) => {
  return (
    <ThreeViewer
      dimensions={dimensions}
      showShadow={showShadow}
      showEdges={showEdges}
      boxColor={boxColor}
      objectName={objectName}
      transformMode={transformMode}
    />
  );
};

export default BoxViewer;
