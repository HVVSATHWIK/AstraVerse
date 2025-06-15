
import React from 'react';

interface WorkflowStatsProps {
  workflow: any;
}

const WorkflowStats = ({ workflow }: WorkflowStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
        <div className="text-2xl font-bold text-white">{workflow.executions || 0}</div>
        <div className="text-slate-400 text-sm">Total Runs</div>
      </div>
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
        <div className="text-2xl font-bold text-green-400">{workflow.successRate || 0}%</div>
        <div className="text-slate-400 text-sm">Success Rate</div>
      </div>
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
        <div className="text-2xl font-bold text-blue-400">{workflow.avgDuration || '2.3s'}</div>
        <div className="text-slate-400 text-sm">Avg Duration</div>
      </div>
    </div>
  );
};

export default WorkflowStats;
