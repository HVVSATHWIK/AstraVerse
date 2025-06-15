
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Settings, Play, Loader2 } from 'lucide-react';
import { useGeminiGenerateMutation } from '@/hooks/api/useGeminiApi';
import { GeminiGenerateRequest } from '@/types/gemini';

interface GeminiActionCardProps {
  onResult?: (result: any) => void;
  initialConfig?: Partial<GeminiGenerateRequest>;
  className?: string;
}

const GeminiActionCard = ({ onResult, initialConfig, className }: GeminiActionCardProps) => {
  const [prompt, setPrompt] = useState(initialConfig?.prompt || '');
  const [context, setContext] = useState(initialConfig?.context || '');
  const [temperature, setTemperature] = useState([initialConfig?.options?.temperature || 0.7]);
  const [maxTokens, setMaxTokens] = useState([initialConfig?.options?.maxTokens || 1024]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const geminiMutation = useGeminiGenerateMutation();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request: GeminiGenerateRequest = {
      prompt: prompt.trim(),
      context: context.trim() || undefined,
      options: {
        temperature: temperature[0],
        maxTokens: maxTokens[0],
        topK: 40,
        topP: 0.95,
      },
    };

    try {
      const result = await geminiMutation.mutateAsync(request);
      onResult?.(result);
    } catch (error) {
      console.error('Gemini generation failed:', error);
    }
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Gemini AI Action</span>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            gemini-1.5-flash
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for Gemini AI..."
            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Context (optional)</Label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Additional context for the AI..."
            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-slate-300 border-slate-600"
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="space-y-2">
              <Label className="text-slate-300">
                Temperature: {temperature[0]}
              </Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-400">
                Controls randomness: 0 = deterministic, 2 = very creative
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">
                Max Tokens: {maxTokens[0]}
              </Label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4096}
                min={128}
                step={128}
                className="w-full"
              />
              <p className="text-xs text-slate-400">
                Maximum length of the generated response
              </p>
            </div>
          </div>
        )}

        {geminiMutation.data && (
          <div className="space-y-2">
            <Label className="text-slate-300">Generated Content</Label>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
              <p className="text-white text-sm whitespace-pre-wrap">
                {geminiMutation.data.content}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-600">
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                  {geminiMutation.data.usage.totalTokens} tokens
                </Badge>
                <span className="text-xs text-slate-400">
                  {geminiMutation.data.finishReason}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || geminiMutation.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {geminiMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Generate with Gemini
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeminiActionCard;
