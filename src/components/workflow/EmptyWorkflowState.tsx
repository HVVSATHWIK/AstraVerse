
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';

interface EmptyWorkflowStateProps {
  onToggleGeminiAction: () => void;
}

const EmptyWorkflowState = ({ onToggleGeminiAction }: EmptyWorkflowStateProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-white mb-4">No Workflows Found</h3>
      <p className="text-slate-400 mb-6">Create your first workflow to get started.</p>
      <div className="flex justify-center space-x-4">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
        <Button 
          variant="outline" 
          className="text-purple-400 border-purple-500/50"
          onClick={onToggleGeminiAction}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Try Gemini AI
        </Button>
      </div>
    </div>
  );
};

export default EmptyWorkflowState;
