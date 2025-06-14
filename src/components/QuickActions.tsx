
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  RefreshCw, 
  Download,
  Upload,
  Settings,
  BarChart3,
  Users
} from 'lucide-react';

const QuickActions = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg mr-3 shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="w-3 h-3 mr-2" />
            New Workflow
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
            <Play className="w-3 h-3 mr-2" />
            Run Test
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
            <RefreshCw className="w-3 h-3 mr-2" />
            Sync Data
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
            <Download className="w-3 h-3 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="pt-3 border-t border-slate-700/50">
          <div className="text-slate-300 text-sm mb-3 font-medium">System Controls</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-slate-200 text-sm">Analytics Engine</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-slate-200 text-sm">User Sessions</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                142 Active
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
