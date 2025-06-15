
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, BarChart3, Bot } from 'lucide-react';

interface ChatWorkflow {
  id: string;
  name: string;
  description: string;
  context: string;
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  stats: {
    totalChats: number;
    totalMessages: number;
    avgResponseTime: number;
    satisfaction: number;
  };
}

interface ChatWorkflowAnalyticsProps {
  workflow: ChatWorkflow;
}

const ChatWorkflowAnalytics = ({ workflow }: ChatWorkflowAnalyticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
          <div className="text-2xl font-bold text-white">{workflow.stats.totalChats}</div>
          <div className="text-slate-400 text-sm">Total Conversations</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-400" />
          <div className="text-2xl font-bold text-white">{workflow.stats.totalMessages}</div>
          <div className="text-slate-400 text-sm">Total Messages</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <div className="text-2xl font-bold text-white">{workflow.stats.avgResponseTime}ms</div>
          <div className="text-slate-400 text-sm">Avg Response Time</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Bot className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <div className="text-2xl font-bold text-white">{workflow.stats.satisfaction}/5</div>
          <div className="text-slate-400 text-sm">Satisfaction Score</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatWorkflowAnalytics;
