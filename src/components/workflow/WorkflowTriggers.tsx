
import React from 'react';
import { Zap } from 'lucide-react';

interface WorkflowTriggersProps {
  workflow: any;
}

const WorkflowTriggers = ({ workflow }: WorkflowTriggersProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
        Triggers
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {workflow.triggers?.map((trigger: any, index: number) => (
          <div key={index} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-slate-300">{trigger.name || trigger}</span>
            </div>
          </div>
        )) || (
          <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-slate-300">Manual Trigger</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowTriggers;
