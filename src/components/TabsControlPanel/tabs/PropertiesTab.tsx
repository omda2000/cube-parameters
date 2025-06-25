
import PropertyPanel from '../../PropertyPanel/PropertyPanel';
import { useSelectionContext } from '../../../contexts/SelectionContext';

const PropertiesTab = () => {
  const { selectedObject } = useSelectionContext();

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject) {
      console.log(`Property changed: ${property} = ${value}`);
      
      // Handle coordinate updates for point objects
      if (selectedObject.type === 'point' && property.includes('position')) {
        const [prop, axis] = property.split('.');
        if (selectedObject.object.position && axis) {
          selectedObject.object.position[axis as 'x' | 'y' | 'z'] = value;
        }
      }
      
      // Handle other object types
      if (selectedObject.object && property.includes('.')) {
        const [prop, axis] = property.split('.');
        if (prop === 'position' && selectedObject.object.position && axis) {
          selectedObject.object.position[axis as 'x' | 'y' | 'z'] = value;
        } else if (prop === 'rotation' && selectedObject.object.rotation && axis) {
          selectedObject.object.rotation[axis as 'x' | 'y' | 'z'] = value;
        } else if (prop === 'scale' && selectedObject.object.scale && axis) {
          selectedObject.object.scale[axis as 'x' | 'y' | 'z'] = value;
        }
      }
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
