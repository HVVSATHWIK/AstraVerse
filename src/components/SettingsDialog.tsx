
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Zap,
  User,
  Globe,
  Save
} from 'lucide-react';

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataRetention, setDataRetention] = useState('30');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.astraai.com');
  const [refreshRate, setRefreshRate] = useState('5');

  const handleSave = () => {
    // In a real app, this would save to a backend or localStorage
    console.log('Settings saved:', {
      notifications,
      autoSave,
      darkMode,
      dataRetention,
      apiEndpoint,
      refreshRate
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            AstraAI Settings
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure your AstraAI platform preferences and system settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* General Settings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-4 h-4 mr-2" />
                General
              </CardTitle>
              <CardDescription className="text-slate-400">
                Basic platform preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200">Dark Mode</Label>
                  <p className="text-sm text-slate-400">Use dark theme for the interface</p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200">Auto-save Workflows</Label>
                  <p className="text-sm text-slate-400">Automatically save workflow changes</p>
                </div>
                <Switch 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Data Refresh Rate</Label>
                <Select value={refreshRate} onValueChange={setRefreshRate}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="1">1 second</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200">Push Notifications</Label>
                  <p className="text-sm text-slate-400">Receive browser notifications</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200">Workflow Alerts</Label>
                  <p className="text-sm text-slate-400">Notify when workflows complete</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200">System Updates</Label>
                  <p className="text-sm text-slate-400">Platform maintenance notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* API & Integrations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                API & Integrations
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure external connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200">API Endpoint</Label>
                <Input 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Connected Apps</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-200 text-sm">Slack</span>
                    <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-200 text-sm">Zoom</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-200 text-sm">Jira</span>
                    <Badge className="bg-slate-500/20 text-slate-400">Disconnected</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Data & Privacy
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage data retention and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Data Retention Period</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200">Analytics Tracking</Label>
                  <p className="text-sm text-slate-400">Help improve the platform</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Export My Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-slate-700 my-6" />

        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">
            Changes are saved automatically
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
