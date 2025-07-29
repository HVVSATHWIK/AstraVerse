import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface InvenChatbotProps {
  apiKey?: string;
}

const InvenChatbot: React.FC<InvenChatbotProps> = ({ apiKey = 'AIzaSyAhCGv0s074UHkU9BexhLm37Fgl2QxcVlk' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Inven, your AI assistant for inventory optimization. I can help you understand how InvenAI can transform your EV manufacturing operations. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // For now, we'll use predefined responses since Gemini API integration might need CORS setup
      const responses = {
        'hello': "Hello! I'm Inven, your AI assistant. I'm here to help you understand how InvenAI can optimize your EV inventory management.",
        'pricing': "InvenAI offers three tiers: Starter ($499/mo) for small manufacturers, Professional ($1,299/mo) with AI forecasting, and Enterprise (custom) with full optimization. Which tier interests you?",
        'features': "Our key features include AI-powered demand forecasting (95% accuracy), automated inventory optimization, real-time stock monitoring, supplier integration, and compliance tracking. What specific challenge are you facing?",
        'demo': "I'd be happy to arrange a demo! You can click 'Request a Demo' button above, or I can connect you with our sales team. What's your company size and current inventory challenges?",
        'integration': "InvenAI integrates seamlessly with major ERP systems, supplier networks, and production planning tools. We support APIs for real-time data sync. What systems are you currently using?",
        'accuracy': "Our AI models achieve 95% accuracy in demand forecasting for EV components. We use machine learning algorithms trained on industry data, seasonal patterns, and market trends. This reduces stockouts by 60% and overstock by 45%.",
        'support': "We provide 24/7 support for Professional and Enterprise tiers, with dedicated success managers for Enterprise clients. Our team includes EV industry experts and AI specialists."
      };

      const lowerMessage = userMessage.toLowerCase();
      let response = "I understand you're asking about inventory optimization. InvenAI specializes in AI-powered solutions for EV manufacturers. Could you tell me more about your specific needs? I can help with information about our features, pricing, integrations, or arrange a demo.";

      // Simple keyword matching
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = responses.hello;
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        response = responses.pricing;
      } else if (lowerMessage.includes('feature') || lowerMessage.includes('capability')) {
        response = responses.features;
      } else if (lowerMessage.includes('demo') || lowerMessage.includes('trial')) {
        response = responses.demo;
      } else if (lowerMessage.includes('integration') || lowerMessage.includes('api')) {
        response = responses.integration;
      } else if (lowerMessage.includes('accuracy') || lowerMessage.includes('forecast')) {
        response = responses.accuracy;
      } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
        response = responses.support;
      }

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for immediate assistance.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const botResponse = await generateResponse(inputValue);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
        <div className="absolute -top-2 -left-2">
          <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            AI
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`bg-slate-900/95 border-slate-700 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        <CardHeader className="pb-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="w-8 h-8 text-blue-400" />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full"></div>
              </div>
              <div>
                <CardTitle className="text-white text-lg">Inven</CardTitle>
                <p className="text-slate-400 text-sm">AI Inventory Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-r from-blue-600 to-green-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-200' : 'text-slate-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-700 p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about inventory optimization..."
                  className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  Powered by AI
                </Badge>
                <p className="text-xs text-slate-500">Ask about features, pricing, or request a demo</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default InvenChatbot;