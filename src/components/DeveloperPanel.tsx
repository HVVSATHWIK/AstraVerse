
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Wifi, WifiOff, RefreshCw, Code } from 'lucide-react';
import env from '@/config/environment';
import { useToast } from '@/hooks/use-toast';

const DeveloperPanel = () => {
  const { toast } = useToast();
  const [apiUrl, setApiUrl] = useState(env.get('apiUrl'));
  const [features, setFeatures] = useState({
    pilotMode: env.get('pilotMode'),
    enableMockApi: env.get('enableMockApi'),
    enableRealtime: env.get('enableRealtime'),
    enableAnalytics: env.get('enableAnalytics'),
  });

  const handleFeatureToggle = (feature: keyof typeof features) => {
    const newValue = !features[feature];
    setFeatures(prev => ({ ...prev, [feature]: newValue }));
    env.updateFeatureFlag(feature, newValue);
    
    toast({
      title: 'Feature Updated',
      description: `${feature} has been ${newValue ? 'enabled' : 'disabled'}`,
    });
  };

  const handleApiUrlUpdate = () => {
    // In a real app, this would update the API client
    toast({
      title: 'API URL Updated',
      description: `API URL set to: ${apiUrl}`,
    });
  };

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    toast({
      title: 'Cache Cleared',
      description: 'All local storage and session storage has been cleared',
    });
  };

  if (!env.isDev()) {
    return null; // Only show in development
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Developer Panel
          <Badge variant="outline" className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
            DEV
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger value="features" className="text-white">Features</TabsTrigger>
            <TabsTrigger value="api" className="text-white">API</TabsTrigger>
            <TabsTrigger value="system" className="text-white">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="space-y-3">
              {Object.entries(features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <Label className="text-white font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <p className="text-slate-400 text-sm">
                      {key === 'pilotMode' && 'Enable experimental features and pilot mode tab'}
                      {key === 'enableMockApi' && 'Use mock API responses instead of real backend'}
                      {key === 'enableRealtime' && 'Enable WebSocket connections for real-time updates'}
                      {key === 'enableAnalytics' && 'Enable analytics tracking and telemetry'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => handleFeatureToggle(key as keyof typeof features)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <Label className="text-white">API Base URL</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="http://localhost:3001/api"
                  />
                  <Button 
                    onClick={handleApiUrlUpdate}
                    variant="outline"
                    className="text-white border-slate-600"
                  >
                    Update
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  {features.enableMockApi ? (
                    <Database className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Wifi className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-white">
                    {features.enableMockApi ? 'Mock API Active' : 'Real API Active'}
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={features.enableMockApi 
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                    : 'bg-green-500/20 text-green-400 border-green-500/50'
                  }
                >
                  {features.enableMockApi ? 'Mock' : 'Live'}
                </Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <Label className="text-white text-sm">Environment</Label>
                  <p className="text-slate-300">{env.getEnvironmentName()}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <Label className="text-white text-sm">Version</Label>
                  <p className="text-slate-300">{env.get('version')}</p>
                </div>
              </div>
              
              <Button 
                onClick={clearCache}
                variant="outline"
                className="w-full text-white border-slate-600 hover:bg-red-600/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Cache & Storage
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeveloperPanel;

