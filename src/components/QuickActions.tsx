
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Settings, BarChart3 } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'New Workflow',
      description: 'Create automation',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Zap,
      label: 'Connect App',
      description: 'Add integration',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Settings,
      label: 'Configure AI',
      description: 'Tune engines',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      description: 'Check insights',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl h-fit" data-tutorial="quick-actions">
      <CardHeader>
        <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start bg-slate-700/30 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 h-auto p-3"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} mr-3 shadow-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-slate-400">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
