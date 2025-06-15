
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'efficiency' | 'cost-saving' | 'automation' | 'integration';
  impact: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedSavings: string;
  timeToImplement: string;
  popularity: number;
  isImplemented: boolean;
  steps: string[];
}

const SmartWorkflowRecommendations = () => {
  const [recommendations] = useState<WorkflowRecommendation[]>([
    {
      id: '1',
      title: 'Automated Document Classification',
      description: 'Automatically categorize and route incoming documents using AI-powered classification.',
      category: 'automation',
      impact: 'high',
      complexity: 'moderate',
      estimatedSavings: '15 hours/week',
      timeToImplement: '2-3 days',
      popularity: 89,
      isImplemented: false,
      steps: [
        'Set up document upload trigger',
        'Configure AI classification model',
        'Create routing rules',
        'Test with sample documents'
      ]
    },
    {
      id: '2',
      title: 'Meeting Summary Generator',
      description: 'Automatically generate meeting summaries and action items from recorded sessions.',
      category: 'efficiency',
      impact: 'high',
      complexity: 'simple',
      estimatedSavings: '8 hours/week',
      timeToImplement: '1 day',
      popularity: 94,
      isImplemented: true,
      steps: [
        'Connect meeting recording service',
        'Set up transcription workflow',
        'Configure summary generation',
        'Define action item extraction'
      ]
    },
    {
      id: '3',
      title: 'Smart Email Response System',
      description: 'AI-powered email categorization and draft response generation for customer support.',
      category: 'automation',
      impact: 'medium',
      complexity: 'complex',
      estimatedSavings: '20 hours/week',
      timeToImplement: '1 week',
      popularity: 76,
      isImplemented: false,
      steps: [
        'Integrate email service',
        'Train classification model',
        'Create response templates',
        'Set up approval workflow'
      ]
    },
    {
      id: '4',
      title: 'Cost Optimization Analyzer',
      description: 'Monitor and analyze AI API usage to identify cost-saving opportunities.',
      category: 'cost-saving',
      impact: 'medium',
      complexity: 'simple',
      estimatedSavings: '$500/month',
      timeToImplement: '4 hours',
      popularity: 67,
      isImplemented: false,
      steps: [
        'Set up usage monitoring',
        'Configure cost thresholds',
        'Create optimization alerts',
        'Implement usage reports'
      ]
    }
  ]);

  const { toast } = useToast();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'efficiency':
        return Clock;
      case 'cost-saving':
        return TrendingUp;
      case 'automation':
        return Zap;
      case 'integration':
        return Users;
      default:
        return Lightbulb;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'efficiency':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cost-saving':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'automation':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'integration':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const implementWorkflow = (recommendation: WorkflowRecommendation) => {
    toast({
      title: 'Workflow Implementation Started',
      description: `Starting implementation of "${recommendation.title}"`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Smart Recommendations</h3>
        </div>
        <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
          {recommendations.filter(r => !r.isImplemented).length} suggestions
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => {
          const CategoryIcon = getCategoryIcon(recommendation.category);
          
          return (
            <Card key={recommendation.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <CategoryIcon className="w-5 h-5 text-blue-400" />
                    <div>
                      <CardTitle className="text-white text-lg">{recommendation.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getCategoryColor(recommendation.category)}>
                          {recommendation.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 text-xs">{recommendation.popularity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {recommendation.isImplemented && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">{recommendation.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-slate-400">Impact:</span>
                    <span className={`ml-2 font-medium ${getImpactColor(recommendation.impact)}`}>
                      {recommendation.impact.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Complexity:</span>
                    <span className="text-white ml-2 capitalize">{recommendation.complexity}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Estimated Savings:</span>
                    <span className="text-green-400 ml-2 font-medium">{recommendation.estimatedSavings}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Implementation:</span>
                    <span className="text-white ml-2">{recommendation.timeToImplement}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-white font-medium text-sm">Implementation Steps:</h5>
                  <ul className="space-y-1">
                    {recommendation.steps.slice(0, 2).map((step, index) => (
                      <li key={index} className="text-slate-400 text-xs flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>{step}</span>
                      </li>
                    ))}
                    {recommendation.steps.length > 2 && (
                      <li className="text-slate-500 text-xs">
                        +{recommendation.steps.length - 2} more steps...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2">
                  {recommendation.isImplemented ? (
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Implemented
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => implementWorkflow(recommendation)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Implement
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    Learn More
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SmartWorkflowRecommendations;
