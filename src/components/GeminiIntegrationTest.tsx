
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Sparkles, CheckCircle, AlertCircle, Loader2, Play } from 'lucide-react';
import { useGeminiGenerateMutation, useCreateGeminiJobMutation } from '@/hooks/api/useGeminiApi';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
  duration?: number;
}

const GeminiIntegrationTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);

  const geminiMutation = useGeminiGenerateMutation();
  const geminiJobMutation = useCreateGeminiJobMutation();
  const { toast } = useToast();

  const testCases = [
    {
      name: 'Basic Text Generation',
      prompt: 'Generate a brief welcome message for an AI automation platform.',
      description: 'Tests basic text generation capabilities'
    },
    {
      name: 'Technical Content',
      prompt: 'Explain the benefits of AI automation in business workflows.',
      description: 'Tests technical content generation'
    },
    {
      name: 'Creative Writing',
      prompt: 'Write a short story about a robot learning to create art.',
      description: 'Tests creative capabilities and temperature settings'
    },
    {
      name: 'Data Analysis',
      prompt: 'Analyze the following data: Sales Q1: $100k, Q2: $150k, Q3: $120k, Q4: $180k. Provide insights.',
      description: 'Tests analytical reasoning'
    }
  ];

  const runSingleTest = async (testCase: any, index: number): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const result = await geminiMutation.mutateAsync({
        prompt: testCase.prompt,
        options: {
          temperature: 0.7,
          maxTokens: 500,
          topK: 40,
          topP: 0.95,
        }
      });

      const duration = Date.now() - startTime;
      
      return {
        test: testCase.name,
        status: 'success',
        result,
        duration
      };
    } catch (error: any) {
      return {
        test: testCase.name,
        status: 'error',
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    const initialResults: TestResult[] = testCases.map(tc => ({
      test: tc.name,
      status: 'pending'
    }));
    setTestResults(initialResults);

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      // Update status to running
      setTestResults(prev => prev.map((result, idx) => 
        idx === i ? { ...result, status: 'running' } : result
      ));

      const result = await runSingleTest(testCase, i);
      
      // Update with final result
      setTestResults(prev => prev.map((r, idx) => 
        idx === i ? result : r
      ));
      
      setProgress(((i + 1) / testCases.length) * 100);
    }

    setIsRunning(false);
    
    const successCount = testResults.filter(r => r.status === 'success').length;
    toast({
      title: 'Integration Tests Complete',
      description: `${successCount}/${testCases.length} tests passed successfully.`,
      variant: successCount === testCases.length ? 'default' : 'destructive',
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-slate-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pending: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
      running: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      success: 'bg-green-500/20 text-green-400 border-green-500/50',
      error: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Gemini Integration Test Suite</span>
        </CardTitle>
        <p className="text-slate-400">
          Test the Gemini AI integration with various scenarios to ensure proper functionality.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          
          {isRunning && (
            <div className="flex items-center space-x-2">
              <Progress value={progress} className="w-32" />
              <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {testCases.map((testCase, index) => {
            const result = testResults[index];
            return (
              <div key={testCase.name} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result?.status || 'pending')}
                    <h4 className="font-medium text-white">{testCase.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result?.duration && (
                      <span className="text-xs text-slate-400">{result.duration}ms</span>
                    )}
                    {getStatusBadge(result?.status || 'pending')}
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 mb-2">{testCase.description}</p>
                
                <div className="bg-slate-800/50 rounded p-2 text-xs text-slate-300 font-mono">
                  {testCase.prompt}
                </div>
                
                {result?.result && (
                  <div className="mt-3 bg-slate-800/50 rounded p-3">
                    <p className="text-sm text-green-400 mb-2">✓ Generated Content:</p>
                    <p className="text-xs text-slate-300 line-clamp-3">
                      {result.result.content}
                    </p>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>Tokens: {result.result.usage?.totalTokens || 'N/A'}</span>
                      <span>Model: {result.result.model}</span>
                    </div>
                  </div>
                )}
                
                {result?.error && (
                  <div className="mt-3 bg-red-900/20 border border-red-500/50 rounded p-3">
                    <p className="text-sm text-red-400 mb-2">✗ Error:</p>
                    <p className="text-xs text-red-300">{result.error}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {testResults.length > 0 && !isRunning && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Test Summary</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-xs text-green-400">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-xs text-red-400">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(testResults.filter(r => r.duration).reduce((sum, r) => sum + (r.duration || 0), 0) / testResults.filter(r => r.duration).length) || 0}ms
                </div>
                <div className="text-xs text-blue-400">Avg Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {testResults.filter(r => r.result?.usage?.totalTokens).reduce((sum, r) => sum + (r.result?.usage?.totalTokens || 0), 0)}
                </div>
                <div className="text-xs text-purple-400">Total Tokens</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiIntegrationTest;
