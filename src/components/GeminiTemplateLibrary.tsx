
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Search, 
  Copy, 
  Play, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Code,
  Mail,
  Zap
} from 'lucide-react';
import { useGeminiGenerateMutation } from '@/hooks/api/useGeminiApi';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  prompt: string;
  variables: string[];
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Generate high-quality content for blogs, articles, and marketing materials',
    category: 'Content',
    icon: FileText,
    prompt: 'Generate a comprehensive {content_type} about {topic}. The content should be {tone} and targeted at {audience}. Include relevant examples and actionable insights.',
    variables: ['content_type', 'topic', 'tone', 'audience'],
    tags: ['content', 'marketing', 'writing']
  },
  {
    id: 'data-analyzer',
    name: 'Data Analyzer',
    description: 'Analyze data sets and provide detailed insights and recommendations',
    category: 'Analytics',
    icon: BarChart3,
    prompt: 'Analyze the following data: {data}. Provide insights on {analysis_type} and suggest {recommendations_count} actionable recommendations for {business_context}.',
    variables: ['data', 'analysis_type', 'recommendations_count', 'business_context'],
    tags: ['data', 'analytics', 'insights']
  },
  {
    id: 'customer-support',
    name: 'Customer Support Assistant',
    description: 'Generate helpful customer support responses and solutions',
    category: 'Support',
    icon: MessageSquare,
    prompt: 'Create a customer support response for: {customer_issue}. The response should be {tone} and include {solution_type}. Address any concerns about {product_context}.',
    variables: ['customer_issue', 'tone', 'solution_type', 'product_context'],
    tags: ['support', 'customer', 'service']
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Review code and suggest improvements for better performance and maintainability',
    category: 'Development',
    icon: Code,
    prompt: 'Review this {language} code: {code}. Focus on {review_type} and provide specific suggestions for improvement. Consider {performance_aspects} and best practices.',
    variables: ['language', 'code', 'review_type', 'performance_aspects'],
    tags: ['code', 'review', 'development']
  },
  {
    id: 'email-composer',
    name: 'Email Composer',
    description: 'Compose professional emails for various business scenarios',
    category: 'Communication',
    icon: Mail,
    prompt: 'Compose a {email_type} email to {recipient}. The purpose is {purpose}. The tone should be {tone} and include {key_points}.',
    variables: ['email_type', 'recipient', 'purpose', 'tone', 'key_points'],
    tags: ['email', 'communication', 'business']
  },
  {
    id: 'workflow-optimizer',
    name: 'Workflow Optimizer',
    description: 'Optimize business workflows and processes for better efficiency',
    category: 'Optimization',
    icon: Zap,
    prompt: 'Analyze this workflow: {workflow_description}. Identify {optimization_areas} bottlenecks and suggest {improvements_count} specific improvements to increase efficiency by {target_improvement}.',
    variables: ['workflow_description', 'optimization_areas', 'improvements_count', 'target_improvement'],
    tags: ['workflow', 'optimization', 'efficiency']
  }
];

const GeminiTemplateLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const geminiMutation = useGeminiGenerateMutation();
  const { toast } = useToast();

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generatePromptFromTemplate = (template: Template) => {
    let prompt = template.prompt;
    template.variables.forEach(variable => {
      const value = templateVariables[variable] || `[${variable}]`;
      prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), value);
    });
    return prompt;
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    const initialVariables: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVariables[variable] = '';
    });
    setTemplateVariables(initialVariables);
    setGeneratedPrompt(generatePromptFromTemplate(template));
  };

  const handleVariableChange = (variable: string, value: string) => {
    const newVariables = { ...templateVariables, [variable]: value };
    setTemplateVariables(newVariables);
    if (selectedTemplate) {
      setGeneratedPrompt(generatePromptFromTemplate({ ...selectedTemplate, variables: selectedTemplate.variables }));
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: 'Prompt Copied',
      description: 'The generated prompt has been copied to your clipboard.',
    });
  };

  const handleExecuteTemplate = async () => {
    if (!selectedTemplate || !generatedPrompt) return;

    try {
      await geminiMutation.mutateAsync({
        prompt: generatedPrompt,
        context: `Template: ${selectedTemplate.name}`,
        options: {
          temperature: 0.7,
          maxTokens: 2048,
          topK: 40,
          topP: 0.95,
        },
      });
    } catch (error) {
      console.error('Template execution failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Gemini Template Library</span>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              {templates.length} Templates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card
                  key={template.id}
                  className={`bg-slate-700/50 border-slate-600 cursor-pointer transition-all duration-200 ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : 'hover:bg-slate-700/70'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-purple-400" />
                      <CardTitle className="text-white text-sm">{template.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs bg-blue-500/20 text-blue-400 border-blue-500/50">
                      {template.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs bg-slate-600/50 text-slate-300 border-slate-500">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Template Configuration */}
      {selectedTemplate && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <selectedTemplate.icon className="w-5 h-5 text-purple-400" />
              <span>{selectedTemplate.name} Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Variable Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplate.variables.map(variable => (
                <div key={variable} className="space-y-2">
                  <Label className="text-slate-300 capitalize">
                    {variable.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    value={templateVariables[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              ))}
            </div>

            {/* Generated Prompt */}
            <div className="space-y-2">
              <Label className="text-slate-300">Generated Prompt</Label>
              <Textarea
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                onClick={handleCopyPrompt}
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </Button>
              <Button
                onClick={handleExecuteTemplate}
                disabled={geminiMutation.isPending || !generatedPrompt}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Execute Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Execution Result */}
      {geminiMutation.data && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Execution Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <p className="text-white text-sm whitespace-pre-wrap">
                {geminiMutation.data.content}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                  {geminiMutation.data.usage.totalTokens} tokens
                </Badge>
                <span className="text-xs text-slate-400">
                  {new Date(geminiMutation.data.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiTemplateLibrary;
