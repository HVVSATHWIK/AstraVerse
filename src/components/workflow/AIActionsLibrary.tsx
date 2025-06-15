
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const AIActionsLibrary = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <span>AI Action Library</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h4 className="text-white font-medium">Content Generation</h4>
            <p className="text-slate-400 text-sm">Generate marketing copy, emails, and documents</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h4 className="text-white font-medium">Data Analysis</h4>
            <p className="text-slate-400 text-sm">Analyze data and generate insights</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h4 className="text-white font-medium">Code Review</h4>
            <p className="text-slate-400 text-sm">Review and improve code quality</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIActionsLibrary;
