
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Trash2, Eye, TreePine } from 'lucide-react';
import SceneTreeView from '../SceneTreeView/SceneTreeView';
import * as THREE from 'three';

interface LoadedModel {
  id: string;
  name: string;
  object: THREE.Group;
  size: number;
}

interface ModelManagerProps {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  onModelSelect: (modelId: string) => void;
  onModelRemove: (modelId: string) => void;
  showPrimitives?: boolean;
  onPrimitiveSelect?: (type: 'box') => void;
}

const ModelManager = ({ 
  loadedModels, 
  currentModel, 
  onModelSelect, 
  onModelRemove,
  showPrimitives = true,
  onPrimitiveSelect
}: ModelManagerProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Box className="h-5 w-5 text-indigo-400" />
        Models
      </h2>

      <Tabs defaultValue="loaded" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
          <TabsTrigger value="loaded" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-indigo-600">
            Models ({loadedModels.length})
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-indigo-600">
            Tree
          </TabsTrigger>
          {showPrimitives && (
            <TabsTrigger value="primitives" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-indigo-600">
              Primitives
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="loaded" className="space-y-2">
          {loadedModels.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Box className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No models loaded</p>
              <p className="text-xs">Upload a 3D model to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {loadedModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    currentModel?.id === model.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {model.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(model.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {currentModel?.id !== model.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onModelSelect(model.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onModelRemove(model.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-2">
          <SceneTreeView model={currentModel} />
        </TabsContent>

        {showPrimitives && (
          <TabsContent value="primitives" className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-slate-700 dark:text-slate-300 border-slate-600 hover:bg-slate-700/50"
              onClick={() => onPrimitiveSelect?.('box')}
            >
              <Box className="h-4 w-4 mr-2" />
              Cube
            </Button>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ModelManager;
