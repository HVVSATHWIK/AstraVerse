
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Settings, Check, X, Star, Download, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'installed' | 'connected';
  rating: number;
  downloads: string;
  icon: string;
  features: string[];
  pricing: 'free' | 'premium' | 'enterprise';
}

const IntegrationHub = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Slack Enhanced',
      description: 'Advanced Slack integration with AI-powered message analysis and automated responses',
      category: 'communication',
      status: 'connected',
      rating: 4.8,
      downloads: '50k+',
      icon: '💬',
      features: ['Message AI Analysis', 'Auto Responses', 'Thread Management', 'Custom Commands'],
      pricing: 'free'
    },
    {
      id: '2',
      name: 'Microsoft Teams Pro',
      description: 'Comprehensive Teams integration with meeting transcription and action item extraction',
      category: 'communication',
      status: 'available',
      rating: 4.6,
      downloads: '25k+',
      icon: '👥',
      features: ['Meeting Transcription', 'Action Items', 'Calendar Sync', 'File Sharing'],
      pricing: 'premium'
    },
    {
      id: '3',
      name: 'Advanced Gmail',
      description: 'Smart email management with AI categorization and priority detection',
      category: 'productivity',
      status: 'installed',
      rating: 4.9,
      downloads: '100k+',
      icon: '📧',
      features: ['Smart Categorization', 'Priority Detection', 'Auto Scheduling', 'Template Management'],
      pricing: 'free'
    },
    {
      id: '4',
      name: 'Salesforce AI',
      description: 'Enhanced CRM integration with predictive analytics and lead scoring',
      category: 'crm',
      status: 'available',
      rating: 4.7,
      downloads: '15k+',
      icon: '💼',
      features: ['Predictive Analytics', 'Lead Scoring', 'Pipeline Management', 'Custom Reports'],
      pricing: 'enterprise'
    },
    {
      id: '5',
      name: 'Jira Smart',
      description: 'Intelligent project management with automated task assignment and progress tracking',
      category: 'project-management',
      status: 'available',
      rating: 4.5,
      downloads: '30k+',
      icon: '📋',
      features: ['Auto Task Assignment', 'Progress Tracking', 'Sprint Planning', 'Time Tracking'],
      pricing: 'premium'
    },
    {
      id: '6',
      name: 'Zapier Advanced',
      description: 'Enhanced automation platform with AI-powered workflow suggestions',
      category: 'automation',
      status: 'connected',
      rating: 4.8,
      downloads: '75k+',
      icon: '⚡',
      features: ['AI Workflow Suggestions', 'Multi-step Automation', 'Error Handling', 'Analytics'],
      pricing: 'premium'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: integrations.length },
    { id: 'communication', name: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'productivity', name: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length },
    { id: 'crm', name: 'CRM', count: integrations.filter(i => i.category === 'crm').length },
    { id: 'project-management', name: 'Project Management', count: integrations.filter(i => i.category === 'project-management').length },
    { id: 'automation', name: 'Automation', count: integrations.filter(i => i.category === 'automation').length }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (integration: Integration) => {
    toast({
      title: 'Installation Started',
      description: `Installing ${integration.name}...`,
    });
    // Simulate installation process
    setTimeout(() => {
      toast({
        title: 'Installation Complete',
        description: `${integration.name} has been successfully installed!`,
      });
    }, 2000);
  };

  const handleConnect = (integration: Integration) => {
    toast({
      title: 'Connection Started',
      description: `Connecting to ${integration.name}...`,
    });
    // Simulate connection process
    setTimeout(() => {
      toast({
        title: 'Connected Successfully',
        description: `${integration.name} is now connected and ready to use!`,
      });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'installed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'available': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-500/20 text-green-400';
      case 'premium': return 'bg-purple-500/20 text-purple-400';
      case 'enterprise': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getActionButton = (integration: Integration) => {
    switch (integration.status) {
      case 'connected':
        return (
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
        );
      case 'installed':
        return (
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleConnect(integration)}
          >
            <Zap className="w-4 h-4 mr-1" />
            Connect
          </Button>
        );
      case 'available':
        return (
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleInstall(integration)}
          >
            <Download className="w-4 h-4 mr-1" />
            Install
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Integration Hub</h2>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Request Integration
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white"
          />
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600" 
                  : "border-slate-600 text-slate-300"
                }
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-slate-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-white text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          <Badge className={getPricingColor(integration.pricing)}>
                            {integration.pricing}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{integration.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{integration.rating}</span>
                      </div>
                      <span className="text-slate-400">{integration.downloads} downloads</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white text-sm font-medium">Key Features:</h4>
                    <div className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-slate-300">{feature}</span>
                        </div>
                      ))}
                      {integration.features.length > 3 && (
                        <span className="text-slate-400 text-xs">+{integration.features.length - 3} more features</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    {getActionButton(integration)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.filter(i => i.status === 'installed').map((integration) => (
              <Card key={integration.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-white">{integration.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">{integration.description}</p>
                  {getActionButton(integration)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.filter(i => i.status === 'connected').map((integration) => (
              <Card key={integration.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-white">{integration.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(integration.status)}>
                        <Check className="w-3 h-3 mr-1" />
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">{integration.description}</p>
                  <div className="flex space-x-2">
                    {getActionButton(integration)}
                    <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                      <X className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;
