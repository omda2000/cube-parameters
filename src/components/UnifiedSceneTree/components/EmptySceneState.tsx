
import { Box } from 'lucide-react';

const EmptySceneState = () => {
  return (
    <div className="text-center py-4 text-slate-400">
      <Box className="h-6 w-6 mx-auto mb-2 opacity-50" />
      <p className="text-sm">No objects in scene</p>
    </div>
  );
};

export default EmptySceneState;
