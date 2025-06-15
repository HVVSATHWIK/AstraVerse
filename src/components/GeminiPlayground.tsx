
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Save, 
  Share, 
  Copy, 
  Download, 
  RefreshCw,
  Settings,
  Sparkles,
  FileText,
  BarChart3
} from 'lucide-react';
import { useGeminiGenerateMutation } from '@/hooks/api/useGeminiApi';
import { useToast } from '@/hooks/use-toast';

interface PlaygroundSettings {
  temperature: number;
  maxTokens: number;
  topK: number;
  topP: number;
  enableSafetySettings: boolean;
}

const GeminiPlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [settings, setSettings] = useState<PlaygroundSettings>({
    temperature: 0.7,
    maxTokens: 1024,
    topK: 40,
    topP: 0.95,
    enableSafetySettings: true
  });
  const [savedPrompts, setSavedPrompts] = useState<Array<{id: string, name: string, prompt: string, settings: PlaygroundSettings}>>([]);
  const [responseHistory, setResponseHistory] = useState<Array<{prompt: string, response: any, timestamp: Date}>>([]);

  const geminiMutation = useGeminiGenerateMutation();
  const { toast } = useToast();

  const handleExecute = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await geminiMutation.mutateAsync({
        prompt: prompt.trim(),
        context: context.trim() || undefined,
        options: {
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          topK: settings.topK,
          topP: settings.topP,
        },
      });

      setResponseHistory(prev => [{
        prompt: prompt.trim(),
        response: result,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep last 10 responses

    } catch (error) {
      console.error('Playground execution failed:', error);
    }
  };

  const handleSavePrompt = () => {
    const name = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
    const newPrompt = {
      id: Date.now().toString(),
      name,
      prompt,
      settings: { ...settings }
    };
    setSavedPrompts(prev => [newPrompt, ...prev]);
    toast({
      title: 'Prompt Saved',
      description: 'Your prompt has been saved to the library.',
    });
  };

  const handleLoadPrompt = (savedPrompt: typeof savedPrompts[0]) => {
    setPrompt(savedPrompt.prompt);
    setSettings(savedPrompt.settings);
  };

  const handleCopyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Response Copied',
      description: 'The response has been copied to your clipboard.',
    });
  };

  const handleDownloadResponse = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const examplePrompts = [
    {
      name: "Creative Writing",
      prompt: "Write a short story about a time traveler who accidentally changes history by buying coffee at the wrong café."
    },
    {
      name: "Code Analysis",
      prompt: "Analyze this Python function and suggest improvements:\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
    },
    {
      name: "Business Strategy",
      prompt: "Create a go-to-market strategy for a new AI-powered productivity app targeting remote teams."
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Gemini AI Playground</span>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              Interactive Testing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompt" className="space-y-4">
            <TabsList className="bg-slate-700/50 border-slate-600">
              <TabsTrigger value="prompt" className="text-slate-300">Prompt</TabsTrigger>
              <TabsTrigger value="settings" className="text-slate-300">Settings</TabsTrigger>
              <TabsTrigger value="examples" className="text-slate-300">Examples</TabsTrigger>
              <TabsTrigger value="saved" className="text-slate-300">Saved ({savedPrompts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Prompt</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt for Gemini AI..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-32"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Context (Optional)</Label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Additional context for the AI..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleExecute}
                  disabled={!prompt.trim() || geminiMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {geminiMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Execute
                </Button>
                <Button
                  onClick={handleSavePrompt}
                  disabled={!prompt.trim()}
                  variant="outline"
                  className="text-slate-300 border-slate-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Temperature: {settings.temperature}
                    </Label>
                    <Slider
                      value={[settings.temperature]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value[0] }))}
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
                      Max Tokens: {settings.maxTokens}
                    </Label>
                    <Slider
                      value={[settings.maxTokens]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokens: value[0] }))}
                      max={4096}
                      min={128}
                      step={128}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Top K: {settings.topK}
                    </Label>
                    <Slider
                      value={[settings.topK]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, topK: value[0] }))}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Top P: {settings.topP}
                    </Label>
                    <Slider
                      value={[settings.topP]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, topP: value[0] }))}
                      max={1}
                      min={0}
                      step={0.05}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.enableSafetySettings}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSafetySettings: checked }))}
                    />
                    <Label className="text-slate-300">Enable Safety Settings</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {examplePrompts.map((example, index) => (
                  <Card key={index} className="bg-slate-700/50 border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">{example.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-3">{example.prompt}</p>
                      <Button
                        size="sm"
                        onClick={() => setPrompt(example.prompt)}
                        variant="outline"
                        className="text-slate-300 border-slate-600"
                      >
                        Use This Prompt
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedPrompts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No saved prompts yet</p>
                  <p className="text-slate-500 text-sm">Save prompts from the Prompt tab to see them here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPrompts.map((savedPrompt) => (
                    <Card key={savedPrompt.id} className="bg-slate-700/50 border-slate-600">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm">{savedPrompt.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm mb-3">{savedPrompt.prompt.slice(0, 150)}...</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleLoadPrompt(savedPrompt)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Load
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSavedPrompts(prev => prev.filter(p => p.id !== savedPrompt.id))}
                            variant="outline"
                            className="text-red-400 border-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response History */}
      {responseHistory.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Response History</span>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                {responseHistory.length} Responses
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {responseHistory.map((item, index) => (
              <Card key={index} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300 text-sm">Prompt:</Label>
                      <p className="text-slate-400 text-sm mt-1">{item.prompt}</p>
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm">Response:</Label>
                      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 mt-1">
                        <p className="text-white text-sm whitespace-pre-wrap">
                          {item.response.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                          {item.response.usage.totalTokens} tokens
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {item.response.model}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyResponse(item.response.content)}
                          className="text-slate-300 border-slate-600"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadResponse(item.response.content)}
                          className="text-slate-300 border-slate-600"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {item.timestamp.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiPlayground;
