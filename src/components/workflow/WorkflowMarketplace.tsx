
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Star, 
  Download, 
  Tag, 
  Clock, 
  Users,
  TrendingUp,
  Filter,
  Heart,
  Share
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  price: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  lastUpdated: string;
  isPopular: boolean;
  isFavorited: boolean;
  preview: string;
}

const WorkflowMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');

  const [templates] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'AI-Powered Content Moderation',
      description: 'Automatically detect and filter inappropriate content using advanced AI models.',
      category: 'Content Management',
      author: 'WorkflowPro',
      rating: 4.8,
      downloads: 1247,
      tags: ['AI', 'Moderation', 'Content', 'Security'],
      price: 'Free',
      complexity: 'intermediate',
      estimatedTime: '30 minutes',
      lastUpdated: '2024-06-10',
      isPopular: true,
      isFavorited: false,
      preview: 'This workflow uses state-of-the-art AI models to analyze and classify content...'
    },
    {
      id: '2',
      name: 'Smart Invoice Processing',
      description: 'Extract data from invoices and automatically update your accounting system.',
      category: 'Finance',
      author: 'AutomateHub',
      rating: 4.9,
      downloads: 2156,
      tags: ['Finance', 'OCR', 'Automation', 'Invoice'],
      price: '$29',
      complexity: 'beginner',
      estimatedTime: '15 minutes',
      lastUpdated: '2024-06-12',
      isPopular: true,
      isFavorited: true,
      preview: 'Streamline your invoice processing with automated data extraction...'
    },
    {
      id: '3',
      name: 'Social Media Sentiment Analysis',
      description: 'Monitor brand mentions and analyze sentiment across social media platforms.',
      category: 'Marketing',
      author: 'SocialTech',
      rating: 4.6,
      downloads: 856,
      tags: ['Social Media', 'Sentiment', 'Analytics', 'Monitoring'],
      price: '$49',
      complexity: 'advanced',
      estimatedTime: '2 hours',
      lastUpdated: '2024-06-08',
      isPopular: false,
      isFavorited: false,
      preview: 'Comprehensive social media monitoring with real-time sentiment analysis...'
    },
    {
      id: '4',
      name: 'Customer Support Ticket Routing',
      description: 'Intelligently route support tickets to the right team based on content analysis.',
      category: 'Customer Service',
      author: 'SupportAI',
      rating: 4.7,
      downloads: 1523,
      tags: ['Support', 'Routing', 'Classification', 'Customer'],
      price: 'Free',
      complexity: 'intermediate',
      estimatedTime: '45 minutes',
      lastUpdated: '2024-06-11',
      isPopular: true,
      isFavorited: true,
      preview: 'Improve response times with intelligent ticket routing and classification...'
    }
  ]);

  const { toast } = useToast();

  const categories = ['all', 'Content Management', 'Finance', 'Marketing', 'Customer Service', 'HR', 'Sales'];
  const complexityLevels = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || template.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const popularTemplates = templates.filter(t => t.isPopular);
  const favoriteTemplates = templates.filter(t => t.isFavorited);

  const installTemplate = (template: WorkflowTemplate) => {
    toast({
      title: 'Template Installed',
      description: `"${template.name}" has been added to your workflows.`,
    });
  };

  const toggleFavorite = (templateId: string) => {
    // In a real app, this would update the backend
    toast({
      title: 'Favorites Updated',
      description: 'Template added to your favorites.',
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const renderTemplateCard = (template: WorkflowTemplate) => (
    <Card key={template.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              {template.isPopular && (
                <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">by {template.author}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleFavorite(template.id)}
              className="p-1"
            >
              <Heart className={`w-4 h-4 ${template.isFavorited ? 'text-red-400 fill-current' : 'text-slate-400'}`} />
            </Button>
            <span className="text-white font-semibold">{template.price}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm">{template.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
              <Tag className="w-2 h-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white">{template.rating}</span>
            <span className="text-slate-400">({template.downloads})</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">{template.estimatedTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getComplexityColor(template.complexity)}>
            {template.complexity}
          </Badge>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
              <Share className="w-3 h-3 mr-1" />
              Share
            </Button>
            <Button 
              size="sm" 
              onClick={() => installTemplate(template)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Workflow Marketplace</h2>
        <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
          {templates.length} templates available
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
              >
                {complexityLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="all" className="text-slate-300">All Templates</TabsTrigger>
          <TabsTrigger value="popular" className="text-slate-300">Popular</TabsTrigger>
          <TabsTrigger value="favorites" className="text-slate-300">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map(renderTemplateCard)}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {popularTemplates.map(renderTemplateCard)}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {favoriteTemplates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteTemplates.map(renderTemplateCard)}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Favorites Yet</h3>
                <p className="text-slate-400">Start exploring templates and add your favorites!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowMarketplace;
