
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useOpenAIGenerateMutation, useOpenAIConfigurationsQuery } from '@/hooks/api/useOpenAIApi';
import { useToast } from '@/hooks/use-toast';
import { Brain, Zap, Settings, Play } from 'lucide-react';

const OpenAIPlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [result, setResult] = useState('');

  const { data: configurations } = useOpenAIConfigurationsQuery();
  const generateMutation = useOpenAIGenerateMutation();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a prompt.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await generateMutation.mutateAsync({
        prompt,
        model,
        temperature: temperature[0],
        max_tokens: maxTokens[0],
        system_prompt: systemPrompt,
      });

      setResult(response.content);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const modelOptions = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Efficient)' },
    { value: 'gpt-4o', label: 'GPT-4o (Advanced)' },
    { value: 'gpt-4.1-2025-04-14', label: 'GPT-4.1 (Latest)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">OpenAI Playground</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-white">System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Set the behavior and context for the AI..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Temperature: {temperature[0]}</Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-400">
                Higher values make output more creative, lower values more focused
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Max Tokens: {maxTokens[0]}</Label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4096}
                min={50}
                step={50}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-white">Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generateMutation.isPending ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 min-h-[400px]">
              {result ? (
                <div className="text-white whitespace-pre-wrap">{result}</div>
              ) : (
                <div className="text-slate-400 text-center py-8">
                  Generated content will appear here...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Configurations */}
      {configurations && configurations.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Saved Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configurations.map((config) => (
                <div
                  key={config.id}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 cursor-pointer hover:bg-slate-700/70 transition-colors"
                  onClick={() => {
                    setModel(config.model);
                    setTemperature([config.temperature]);
                    setMaxTokens([config.max_tokens]);
                    setSystemPrompt(config.system_prompt || '');
                  }}
                >
                  <h4 className="text-white font-medium">{config.name}</h4>
                  <p className="text-slate-400 text-sm">{config.model}</p>
                  <p className="text-slate-400 text-xs">Temp: {config.temperature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpenAIPlayground;
