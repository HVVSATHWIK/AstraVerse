
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Settings, 
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy
} from 'lucide-react';
import { useGeminiGenerateMutation } from '@/hooks/api/useGeminiApi';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    model?: string;
    duration?: number;
  };
}

interface AIChatWorkflowProps {
  workflowId?: string;
  className?: string;
}

const AIChatWorkflow = ({ workflowId, className }: AIChatWorkflowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [context, setContext] = useState('You are a helpful AI assistant integrated into an automation workflow.');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const geminiMutation = useGeminiGenerateMutation();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || geminiMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Build conversation context
    const conversationHistory = [...messages, userMessage]
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const fullContext = `${context}\n\nConversation history:\n${conversationHistory}`;

    try {
      const startTime = Date.now();
      const response = await geminiMutation.mutateAsync({
        prompt: userMessage.content,
        context: fullContext,
        options: {
          temperature: 0.7,
          maxTokens: 1024,
        },
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        metadata: {
          tokens: response.usage.totalTokens,
          model: response.model,
          duration: Date.now() - startTime,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: 'Chat Cleared',
      description: 'Conversation history has been reset.',
    });
  };

  const exportChat = () => {
    const chatData = {
      workflowId,
      context,
      messages,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-workflow-${workflowId || 'session'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Chat Exported',
      description: 'Conversation has been downloaded as JSON.',
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard.',
    });
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span>AI Chat Workflow</span>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              Gemini
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsActive(!isActive)}
              className={`text-white border-slate-600 ${
                isActive ? 'bg-green-600/20 border-green-500' : ''
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearChat}
              className="text-white border-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportChat}
              className="text-white border-slate-600"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="h-96 w-full border border-slate-600 rounded-lg">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                <p>Start a conversation with your AI assistant</p>
                <p className="text-sm">Messages will appear here as you chat</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.metadata && (
                        <div className="mt-2 text-xs opacity-75 flex items-center justify-between">
                          <span>{message.metadata.tokens} tokens</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-6 w-6 p-0 hover:bg-white/10"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            {geminiMutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="text-slate-300">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={geminiMutation.isPending || !isActive}
            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || geminiMutation.isPending || !isActive}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={
              isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
            }>
              {isActive ? 'Active' : 'Paused'}
            </Badge>
            <span>{messages.length} messages</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Powered by Gemini</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatWorkflow;
