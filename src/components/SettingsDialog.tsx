import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Zap,
  User,
  Globe,
  Save,
  Layout,
  Eye,
  Languages,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Volume2,
  Clock,
  FileText,
  Share2,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog = ({ isOpen, onClose }: SettingsDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // User preferences
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [defaultView, setDefaultView] = useState('overview');
  const [timezone, setTimezone] = useState('UTC');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [workflowAlerts, setWorkflowAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [mobileNotifications, setMobileNotifications] = useState(true);
  
  // Privacy settings
  const [dataCollection, setDataCollection] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityTracking, setActivityTracking] = useState(true);
  const [shareUsageData, setShareUsageData] = useState(true);
  
  // API settings
  const [apiEndpoint, setApiEndpoint] = useState('https://api.astraai.com');
  const [refreshRate, setRefreshRate] = useState('30');
  
  // Layout settings
  const [compactMode, setCompactMode] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [sidebarPosition, setSidebarPosition] = useState('left');
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [apiKeyVisibility, setApiKeyVisibility] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to a backend or localStorage
    const settings = {
      theme,
      language,
      defaultView,
      timezone,
      notifications: {
        email: emailNotifications,
        desktop: desktopNotifications,
        workflow: workflowAlerts,
        system: systemUpdates,
        sound: soundAlerts,
        mobile: mobileNotifications
      },
      privacy: {
        dataCollection,
        profileVisibility,
        activityTracking,
        shareUsageData
      },
      api: {
        endpoint: apiEndpoint,
        refreshRate
      },
      layout: {
        compactMode,
        showMetrics,
        sidebarPosition
      },
      security: {
        twoFactorAuth,
        sessionTimeout,
        apiKeyVisibility
      }
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('astraai-settings', JSON.stringify(settings));
    
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            AstraAI Settings
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure your AstraAI platform preferences and system settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-800 p-1">
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Zap className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme & Display
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-200">Dark Mode</Label>
                      <p className="text-sm text-slate-400">Switch between light and dark themes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-slate-400" />
                      <Switch 
                        checked={theme === 'dark'} 
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                      <Moon className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Default Dashboard View</Label>
                    <Select value={defaultView} onValueChange={setDefaultView}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="workflows">Workflows</SelectItem>
                        <SelectItem value="agents">Agents</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Japan (JST)</SelectItem>
                        <SelectItem value="Asia/Shanghai">China (CST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Australia (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Layout className="w-4 h-4 mr-2" />
                  Layout Options
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Customize the layout of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Compact Mode</Label>
                    <p className="text-sm text-slate-400">Reduce spacing for more content</p>
                  </div>
                  <Switch 
                    checked={compactMode} 
                    onCheckedChange={setCompactMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Show Metrics</Label>
                    <p className="text-sm text-slate-400">Display performance metrics on dashboard</p>
                  </div>
                  <Switch 
                    checked={showMetrics} 
                    onCheckedChange={setShowMetrics}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Sidebar Position</Label>
                  <Select value={sidebarPosition} onValueChange={setSidebarPosition}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Channels
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Email Notifications</Label>
                    <p className="text-sm text-slate-400">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Desktop Notifications</Label>
                    <p className="text-sm text-slate-400">Show desktop notifications</p>
                  </div>
                  <Switch 
                    checked={desktopNotifications} 
                    onCheckedChange={setDesktopNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Mobile Notifications</Label>
                    <p className="text-sm text-slate-400">Send notifications to mobile devices</p>
                  </div>
                  <Switch 
                    checked={mobileNotifications} 
                    onCheckedChange={setMobileNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Sound Alerts</Label>
                    <p className="text-sm text-slate-400">Play sound for important notifications</p>
                  </div>
                  <Switch 
                    checked={soundAlerts} 
                    onCheckedChange={setSoundAlerts}
                  />
                </div>

                <Separator className="bg-slate-700 my-4" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Workflow Alerts</Label>
                    <p className="text-sm text-slate-400">Notifications for workflow status changes</p>
                  </div>
                  <Switch 
                    checked={workflowAlerts} 
                    onCheckedChange={setWorkflowAlerts}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">System Updates</Label>
                    <p className="text-sm text-slate-400">Platform maintenance notifications</p>
                  </div>
                  <Switch 
                    checked={systemUpdates} 
                    onCheckedChange={setSystemUpdates}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure what types of notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Notification Priority</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="important">Important Only</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">Workflow Notifications</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Status Changes</SelectItem>
                      <SelectItem value="completion">Completion Only</SelectItem>
                      <SelectItem value="errors">Errors Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">Agent Notifications</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Agent Activities</SelectItem>
                      <SelectItem value="status">Status Changes Only</SelectItem>
                      <SelectItem value="errors">Errors Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">Integration Notifications</Label>
                  <Select defaultValue="errors">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Integration Events</SelectItem>
                      <SelectItem value="sync">Sync Events Only</SelectItem>
                      <SelectItem value="errors">Errors Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Data Privacy & Sharing
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your data privacy and sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Data Collection</Label>
                    <p className="text-sm text-slate-400">Allow anonymous usage data collection</p>
                  </div>
                  <Switch 
                    checked={dataCollection} 
                    onCheckedChange={setDataCollection}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Profile Visibility</Label>
                    <p className="text-sm text-slate-400">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    checked={profileVisibility} 
                    onCheckedChange={setProfileVisibility}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Activity Tracking</Label>
                    <p className="text-sm text-slate-400">Track your activity for personalized insights</p>
                  </div>
                  <Switch 
                    checked={activityTracking} 
                    onCheckedChange={setActivityTracking}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Share Usage Data</Label>
                    <p className="text-sm text-slate-400">Share anonymized usage data to improve the platform</p>
                  </div>
                  <Switch 
                    checked={shareUsageData} 
                    onCheckedChange={setShareUsageData}
                  />
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-4">
                  <p className="text-blue-300 text-sm">
                    💡 <strong>Privacy tip:</strong> Your data is always encrypted and stored securely. You can request a full export or deletion of your data at any time.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Data Sharing Controls
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Control how your data is shared with integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Default Sharing Level</Label>
                  <Select defaultValue="minimal">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">Share All Data</SelectItem>
                      <SelectItem value="standard">Standard (Recommended)</SelectItem>
                      <SelectItem value="minimal">Minimal Sharing</SelectItem>
                      <SelectItem value="none">No Sharing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Third-Party Analytics</Label>
                    <p className="text-sm text-slate-400">Allow third-party analytics services</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Integration Data Access</Label>
                    <p className="text-sm text-slate-400">Allow integrations to access your data</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={twoFactorAuth} 
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">Session Timeout (minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">API Key Visibility</Label>
                    <p className="text-sm text-slate-400">Show API keys in the interface</p>
                  </div>
                  <Switch 
                    checked={apiKeyVisibility} 
                    onCheckedChange={setApiKeyVisibility}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  API Access
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage API keys and access tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-slate-200">Primary API Key</Label>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                      Active
                    </Badge>
                  </div>
                  <div className="bg-slate-800 p-2 rounded font-mono text-xs text-slate-300">
                    {apiKeyVisibility ? 'sk_live_astra_ai_12345678abcdefgh' : '••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Manage API Keys
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6 mt-6">
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
                  <Label className="text-slate-200">Data Refresh Rate (seconds)</Label>
                  <Select value={refreshRate} onValueChange={setRefreshRate}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Connected Services</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-200 text-sm">Supabase</span>
                      <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-200 text-sm">Google Gemini</span>
                      <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Data Management
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your data and storage preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export All Data
                </Button>
                
                <Button variant="outline" className="w-full text-red-400 border-red-500/50 hover:bg-red-900/20">
                  Clear Cache & Storage
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="bg-slate-700 my-6" />

        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">
            {user?.email}
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