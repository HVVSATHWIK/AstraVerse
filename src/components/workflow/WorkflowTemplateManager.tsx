
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Plus, Star, Download, Upload, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  nodes: number;
  preview: string;
  isPublic: boolean;
}

const WorkflowTemplateManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'automation',
    tags: '',
    complexity: 'beginner' as const,
    isPublic: false
  });

  const templates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Email Automation Suite',
      description: 'Complete email workflow with AI content generation, scheduling, and response tracking',
      category: 'communication',
      rating: 4.8,
      downloads: 1250,
      author: 'AstraAI Team',
      tags: ['email', 'automation', 'ai', 'scheduling'],
      complexity: 'intermediate',
      estimatedTime: '15 min',
      nodes: 8,
      preview: 'Email Trigger → AI Content → Send → Track Response → Follow-up',
      isPublic: true
    },
    {
      id: '2',
      name: 'Customer Support Bot',
      description: 'Intelligent customer support workflow with ticket routing and AI responses',
      category: 'customer-service',
      rating: 4.9,
      downloads: 2100,
      author: 'Support Team',
      tags: ['support', 'chatbot', 'tickets', 'ai'],
      complexity: 'advanced',
      estimatedTime: '30 min',
      nodes: 12,
      preview: 'Message Received → AI Analysis → Route to Department → Generate Response',
      isPublic: true
    },
    {
      id: '3',
      name: 'Social Media Scheduler',
      description: 'Multi-platform social media posting with AI content optimization',
      category: 'marketing',
      rating: 4.6,
      downloads: 875,
      author: 'Marketing Pro',
      tags: ['social', 'scheduling', 'content', 'analytics'],
      complexity: 'beginner',
      estimatedTime: '10 min',
      nodes: 6,
      preview: 'Content Creation → AI Optimization → Schedule → Post → Analytics',
      isPublic: true
    },
    {
      id: '4',
      name: 'Invoice Processing',
      description: 'Automated invoice processing with AI data extraction and approval workflow',
      category: 'finance',
      rating: 4.7,
      downloads: 650,
      author: 'Finance Team',
      tags: ['finance', 'invoices', 'approval', 'ocr'],
      complexity: 'intermediate',
      estimatedTime: '20 min',
      nodes: 10,
      preview: 'Invoice Upload → AI Extraction → Validation → Approval → Payment',
      isPublic: false
    },
    {
      id: '5',
      name: 'Lead Qualification',
      description: 'Smart lead scoring and qualification using AI analysis',
      category: 'sales',
      rating: 4.8,
      downloads: 1420,
      author: 'Sales Team',
      tags: ['leads', 'scoring', 'crm', 'qualification'],
      complexity: 'advanced',
      estimatedTime: '25 min',
      nodes: 15,
      preview: 'Lead Capture → AI Scoring → Qualification → Route to Sales → Follow-up',
      isPublic: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'communication', name: 'Communication', count: templates.filter(t => t.category === 'communication').length },
    { id: 'marketing', name: 'Marketing', count: templates.filter(t => t.category === 'marketing').length },
    { id: 'sales', name: 'Sales', count: templates.filter(t => t.category === 'sales').length },
    { id: 'customer-service', name: 'Support', count: templates.filter(t => t.category === 'customer-service').length },
    { id: 'finance', name: 'Finance', count: templates.filter(t => t.category === 'finance').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    const template = {
      ...newTemplate,
      id: Date.now().toString(),
      rating: 0,
      downloads: 0,
      author: 'You',
      tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      estimatedTime: '5 min',
      nodes: 3,
      preview: 'Custom workflow template'
    };
    
    console.log('Created template:', template);
    
    toast({
      title: 'Template Created',
      description: `"${newTemplate.name}" has been created successfully!`,
    });
    
    setIsCreateModalOpen(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'automation',
      tags: '',
      complexity: 'beginner',
      isPublic: false
    });
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    toast({
      title: 'Template Loaded',
      description: `"${template.name}" is now ready for customization.`,
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Workflow Templates</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="My Awesome Workflow"
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe what this workflow does..."
                />
              </div>

              <div>
                <Label className="text-slate-300">Tags (comma separated)</Label>
                <Input
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="automation, ai, productivity"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTemplate}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white"
          />
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
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

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-slate-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                          {template.nodes} nodes
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{template.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{template.description}</p>
                  
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs mb-1">Workflow Preview:</div>
                    <div className="text-slate-300 text-sm">{template.preview}</div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-slate-400 border-slate-600">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>by {template.author}</span>
                    <div className="flex items-center space-x-2">
                      <Download className="w-3 h-3" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-templates">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-white mb-2">Your Templates</h3>
            <p className="text-slate-400 mb-6">Templates you've created will appear here</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-white mb-2">Favorite Templates</h3>
            <p className="text-slate-400 mb-6">Templates you've starred will appear here</p>
            <Button 
              onClick={() => setSelectedCategory('all')}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              Browse Templates
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowTemplateManager;
