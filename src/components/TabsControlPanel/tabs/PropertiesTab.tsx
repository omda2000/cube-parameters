
import EnhancedPropertyPanel from '../../PropertyPanel/EnhancedPropertyPanel';
import { useSelectionContext } from '../../../contexts/SelectionContext';

const PropertiesTab = () => {
  const { selectedObjects } = useSelectionContext();

  const selectedObject = selectedObjects.length > 0 ? selectedObjects[0] : null;

  // Handle property changes
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedObject) return;
    
    if (property === 'name') {
      selectedObject.object.name = value;
      selectedObject.name = value;
    } else if (property === 'visibility') {
      selectedObject.object.visible = value;
      selectedObject.visible = value;
    }
  };

  return (
    <EnhancedPropertyPanel 
      selectedObject={selectedObject}
      onPropertyChange={handlePropertyChange}
    />
  );
};

export default PropertiesTab;
