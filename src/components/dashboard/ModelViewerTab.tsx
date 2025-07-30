import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ModelViewerSection from './sections/ModelViewerSection';

const ModelViewerTab = () => {
  return (
    <TabsContent value="model-viewer" className="space-y-8">
      <ModelViewerSection />
    </TabsContent>
  );
};

export default ModelViewerTab;