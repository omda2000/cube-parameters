
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Current3DApp from "@/components/Current3DApp";
import Online3DViewer from "@/components/Online3DViewer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            3D Applications Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of 3D visualization tools and professional model viewers
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="current" className="text-lg py-3">
              3D Visualizer
            </TabsTrigger>
            <TabsTrigger value="online" className="text-lg py-3">
              Online 3D Viewer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-0">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Current3DApp />
            </div>
          </TabsContent>

          <TabsContent value="online" className="mt-0">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Online3DViewer />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
