
import PropertyPanel from '../../PropertyPanel/PropertyPanel';
import { useSelectionContext } from '../../../contexts/SelectionContext';

const PropertiesTab = () => {
  const { selectedObject } = useSelectionContext();

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject) {
      console.log(`Property changed: ${property} = ${value}`);
    }
  };

  return (
    <PropertyPanel
      selectedObject={selectedObject}
      onPropertyChange={handlePropertyChange}
    />
  );
};

export default PropertiesTab;
