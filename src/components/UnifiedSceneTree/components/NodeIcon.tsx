
import { Box, Triangle, Sun, TreePine, MapPin, Ruler } from 'lucide-react';

interface NodeIconProps {
  type: string;
}

const NodeIcon = ({ type }: NodeIconProps) => {
  switch (type) {
    case 'mesh':
      return <Triangle className="h-4 w-4 text-green-400" />;
    case 'group':
      return <Box className="h-4 w-4 text-blue-400" />;
    case 'primitive':
      return <Box className="h-4 w-4 text-purple-400" />;
    case 'ground':
      return <TreePine className="h-4 w-4 text-brown-400" />;
    case 'light':
      return <Sun className="h-4 w-4 text-yellow-400" />;
    case 'point':
      return <MapPin className="h-4 w-4 text-red-400" />;
    case 'measurement':
      return <Ruler className="h-4 w-4 text-orange-400" />;
    default:
      return <Box className="h-4 w-4 text-gray-400" />;
  }
};

export default NodeIcon;
