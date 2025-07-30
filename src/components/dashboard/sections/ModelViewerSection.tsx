import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Settings, 
  Zap,
  Car,
  Battery,
  Lightbulb,
  Circle
} from 'lucide-react';
import EVModel from '@/components/3D/EVModel';
import InteractiveCard3D from '@/components/3D/InteractiveCard3D';

const ModelViewerSection = () => {
  const [liveRendering, setLiveRendering] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const partInfo = {
    body: { 
      name: 'Car Body', 
      icon: Car, 
      description: 'Main chassis and exterior body panels',
      specs: 'Aerodynamic design, Lightweight aluminum frame'
    },
    wheels: { 
      name: 'Wheels', 
      icon: Circle, 
      description: 'All-wheel drive electric motors',
      specs: '4x Independent motors, Regenerative braking'
    },
    battery: { 
      name: 'Battery Pack', 
      icon: Battery, 
      description: 'High-capacity lithium-ion battery',
      specs: '100kWh capacity, 500km range, Fast charging'
    },
    lights: { 
      name: 'LED Lights', 
      icon: Lightbulb, 
      description: 'Smart adaptive LED lighting system',
      specs: 'Auto-adjusting brightness, Energy efficient'
    }
  };

  const handlePartSelect = (part: string) => {
    console.log(`🔍 Part selected: ${part}`);
    setSelectedPart(selectedPart === part ? null : part);
  };

  const resetView = () => {
    setSelectedPart(null);
    console.log('🔄 View reset');
  };

  return (
    <section className="space-y-6 animate-fade-in-3d stagger-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white text-3d">3D Model Viewer</h2>
        <div className="flex items-center gap-2">
          <Badge variant={liveRendering ? "default" : "secondary"} className="animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            {liveRendering ? 'Live Rendering' : 'Paused'}
          </Badge>
          <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1 ml-6"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main 3D Viewer */}
        <div className="xl:col-span-3 animate-scale-in-3d stagger-3">
          <InteractiveCard3D className="h-full">
            <Card className="h-full bg-slate-900/50 border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">EV Model Interactive View</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLiveRendering(!liveRendering)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {liveRendering ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetView}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="three-model-container" style={{ height: '600px', width: '100%' }}>
                  {liveRendering ? (
                    <EVModel 
                      onPartSelect={handlePartSelect}
                      selectedPart={selectedPart}
                      debugMode={debugMode}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg">
                      <div className="text-center">
                        <Pause className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Rendering Paused</p>
                        <p className="text-slate-500 text-sm">Click play to resume</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </InteractiveCard3D>
        </div>

        {/* Controls & Info Panel */}
        <div className="xl:col-span-1 space-y-4 animate-bounce-in-3d stagger-4">
          {/* Controls */}
          <InteractiveCard3D>
            <Card className="bg-slate-900/50 border-slate-700/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="live-rendering" className="text-slate-300 text-sm">
                    Live Rendering
                  </Label>
                  <Switch
                    id="live-rendering"
                    checked={liveRendering}
                    onCheckedChange={setLiveRendering}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode" className="text-slate-300 text-sm">
                    Debug Mode
                  </Label>
                  <Switch
                    id="debug-mode"
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rotate" className="text-slate-300 text-sm">
                    Auto Rotate
                  </Label>
                  <Switch
                    id="auto-rotate"
                    checked={autoRotate}
                    onCheckedChange={setAutoRotate}
                  />
                </div>
              </CardContent>
            </Card>
          </InteractiveCard3D>

          {/* Part Information */}
          <InteractiveCard3D>
            <Card className="bg-slate-900/50 border-slate-700/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-base">Part Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPart && partInfo[selectedPart as keyof typeof partInfo] ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {React.createElement(partInfo[selectedPart as keyof typeof partInfo].icon, {
                        className: "w-5 h-5 text-blue-400"
                      })}
                      <h3 className="text-white font-medium">
                        {partInfo[selectedPart as keyof typeof partInfo].name}
                      </h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {partInfo[selectedPart as keyof typeof partInfo].description}
                    </p>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs font-medium mb-1">SPECIFICATIONS</p>
                      <p className="text-slate-300 text-xs">
                        {partInfo[selectedPart as keyof typeof partInfo].specs}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Car className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Click on a part to view details</p>
                    <p className="text-slate-500 text-xs mt-1">Interactive components are highlighted</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </InteractiveCard3D>

          {/* Instructions */}
          <InteractiveCard3D>
            <Card className="bg-slate-900/50 border-slate-700/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-base">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-slate-400">
                  <div>🖱️ <span className="text-slate-300">Drag to rotate</span></div>
                  <div>🔍 <span className="text-slate-300">Scroll to zoom</span></div>
                  <div>👆 <span className="text-slate-300">Click parts to inspect</span></div>
                  <div>⚡ <span className="text-slate-300">WebGL accelerated</span></div>
                </div>
              </CardContent>
            </Card>
          </InteractiveCard3D>
        </div>
      </div>
    </section>
  );
};

export default ModelViewerSection;