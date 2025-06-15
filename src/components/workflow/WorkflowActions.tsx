
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Sparkles } from 'lucide-react';

interface WorkflowActionsProps {
  workflow: any;
}

const WorkflowActions = ({ workflow }: WorkflowActionsProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
        <GitBranch className="w-5 h-5 mr-2 text-blue-400" />
        Actions
      </h4>
      <div className="space-y-3">
        {workflow.actions?.map((action: any, index: number) => (
          <div key={index} className="flex items-center space-x-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-bold">
              {index + 1}
            </div>
            <span className="text-slate-300 flex-1">{action.name || action}</span>
            {action.type === 'gemini_ai' && (
              <Sparkles className="w-4 h-4 text-purple-400" />
            )}
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
              Active
            </Badge>
          </div>
        )) || (
          <>
            <div className="flex items-center space-x-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-bold">
                1
              </div>
              <span className="text-slate-300 flex-1">Execute Action</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                Active
              </Badge>
            </div>
            <div className="flex items-center space-x-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white text-sm font-bold">
                2
              </div>
              <span className="text-slate-300 flex-1">Gemini AI Processing</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                AI
              </Badge>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkflowActions;
