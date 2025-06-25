
import MaterialControls from '../../MaterialControls';

interface MaterialsTabProps {
  dimensions: { length: number; width: number; height: number };
  setDimensions: (dimensions: { length: number; width: number; height: number }) => void;
  boxColor: string;
  setBoxColor: (color: string) => void;
  objectName: string;
  setObjectName: (name: string) => void;
}

const MaterialsTab = ({
  dimensions,
  setDimensions,
  boxColor,
  setBoxColor,
  objectName,
  setObjectName
}: MaterialsTabProps) => {
  return (
    <MaterialControls 
      dimensions={dimensions}
      setDimensions={setDimensions}
      boxColor={boxColor}
      setBoxColor={setBoxColor}
      objectName={objectName}
      setObjectName={setObjectName}
    />
  );
};

export default MaterialsTab;
