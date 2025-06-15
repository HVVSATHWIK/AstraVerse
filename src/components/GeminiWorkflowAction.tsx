
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Settings, Play, Loader2, Copy, Download } from 'lucide-react';
import { useGeminiGenerateMutation } from '@/hooks/api/useGeminiApi';
import { useToast } from '@/hooks/use-toast';

interface GeminiWorkflowActionProps {
  workflowId?: string;
  onActionComplete?: (result: any) => void;
  className?: string;
}

const GeminiWorkflowAction = ({ workflowId, onActionComplete, className }: GeminiWorkflowActionProps) => {
  const [prompt, setPrompt] = useState('');
  const [actionType, setActionType] = useState('content-generation');
  const [temperature, setTemperature] = useState(0.7);
  const [result, setResult] = useState<any>(null);

  const geminiMutation = useGeminiGenerateMutation();
  const { toast } = useToast();

  const actionTemplates = {
    'content-generation': {
      label: 'Content Generation',
      description: 'Generate text content, articles, or documentation',
      prompt: 'Generate professional content about: ',
    },
    'data-analysis': {
      label: 'Data Analysis',
      description: 'Analyze data and provide insights',
      prompt: 'Analyze the following data and provide insights: ',
    },
    'workflow-optimization': {
      label: 'Workflow Optimization',
      description: 'Suggest improvements for workflows',
      prompt: 'Review this workflow and suggest optimizations: ',
    },
    'code-review': {
      label: 'Code Review',
      description: 'Review code and suggest improvements',
      prompt: 'Review this code and provide feedback: ',
    },
  };

  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    const template = actionTemplates[value as keyof typeof actionTemplates];
    if (template) {
      setPrompt(template.prompt);
    }
  };

  const handleExecute = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await geminiMutation.mutateAsync({
        prompt: prompt.trim(),
        context: workflowId ? `Workflow ID: ${workflowId}` : undefined,
        options: {
          temperature,
          maxTokens: 2048,
          topK: 40,
          topP: 0.95,
        },
      });

      setResult(result);
      onActionComplete?.(result);

      toast({
        title: 'Gemini Action Completed',
        description: `Successfully generated ${result.content.length} characters of content.`,
      });
    } catch (error) {
      console.error('Gemini action failed:', error);
    }
  };

  const handleCopyResult = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      toast({
        title: 'Copied to Clipboard',
        description: 'Result has been copied to your clipboard.',
      });
    }
  };

  const handleDownloadResult = () => {
    if (result?.content) {
      const blob = new Blob([result.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gemini-result-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Gemini Workflow Action</span>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Action Type</Label>
          <Select value={actionType} onValueChange={handleActionTypeChange}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {Object.entries(actionTemplates).map(([key, template]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                  <div>
                    <div className="font-medium">{template.label}</div>
                    <div className="text-xs text-slate-400">{template.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for Gemini AI..."
            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            rows={4}
          />
        </div>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Generated Result</Label>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyResult}
                  className="text-slate-300 border-slate-600"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadResult}
                  className="text-slate-300 border-slate-600"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-white text-sm whitespace-pre-wrap">
                {result.content}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                <div className="flex space-x-2">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                    {result.usage.totalTokens} tokens
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                    {result.model}
                  </Badge>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(result.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleExecute}
          disabled={!prompt.trim() || geminiMutation.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {geminiMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Execute Gemini Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeminiWorkflowAction;
