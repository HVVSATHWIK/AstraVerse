import React from 'react';
import { Button } from '@/components/ui/button';
import { nodeTypes } from '@/constants/nodeTypes';
import { Separator } from '@/components/ui/separator';

interface NodePaletteProps {
  onAddNode: (type: 'trigger' | 'action' | 'condition' | 'gemini_ai') => void;
}

const NodePalette = ({ onAddNode }: NodePaletteProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">Triggers</h3>
        <p className="text-xs text-slate-400 mb-2">Start your workflow with a trigger event</p>
        <Button
          onClick={() => onAddNode('trigger')}
          variant="outline"
          className="w-full justify-start bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
        >
          {React.createElement(nodeTypes.trigger.icon, { className: "w-4 h-4 mr-2" })}
          Add Trigger
        </Button>
      </div>

      <Separator className="bg-slate-700/50 my-4" />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">Actions</h3>
        <p className="text-xs text-slate-400 mb-2">Add actions to process data</p>
        <Button
          onClick={() => onAddNode('action')}
          variant="outline"
          className="w-full justify-start bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
        >
          {React.createElement(nodeTypes.action.icon, { className: "w-4 h-4 mr-2" })}
          Add Action
        </Button>
      </div>

      <Separator className="bg-slate-700/50 my-4" />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">Logic</h3>
        <p className="text-xs text-slate-400 mb-2">Add conditional logic to your workflow</p>
        <Button
          onClick={() => onAddNode('condition')}
          variant="outline"
          className="w-full justify-start bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
        >
          {React.createElement(nodeTypes.condition.icon, { className: "w-4 h-4 mr-2" })}
          Add Condition
        </Button>
      </div>

      <Separator className="bg-slate-700/50 my-4" />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">AI</h3>
        <p className="text-xs text-slate-400 mb-2">Add AI-powered processing</p>
        <Button
          onClick={() => onAddNode('gemini_ai')}
          variant="outline"
          className="w-full justify-start bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
        >
          {React.createElement(nodeTypes.gemini_ai.icon, { className: "w-4 h-4 mr-2" })}
          Add Gemini AI
        </Button>
      </div>
    </div>
  );
};

export default NodePalette;