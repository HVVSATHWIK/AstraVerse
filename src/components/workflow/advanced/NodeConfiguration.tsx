
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';
import { nodeTypes } from '@/constants/nodeTypes';

interface NodeConfigurationProps {
  selectedNode: WorkflowNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const NodeConfiguration = ({ selectedNode, onUpdateNode }: NodeConfigurationProps) => {
  if (!selectedNode) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">Select a Node</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Click on a node to configure it</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg">Node Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Node Name</Label>
            <Input
              value={selectedNode.name}
              onChange={(e) => onUpdateNode(selectedNode.id, { name: e.target.value })}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Node Type</Label>
            <Select
              value={selectedNode.type}
              onValueChange={(value) => onUpdateNode(selectedNode.id, { type: value as any })}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.keys(nodeTypes).map(type => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                    {type.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNode.type === 'gemini_ai' && (
            <div className="space-y-2">
              <Label className="text-slate-300">AI Prompt</Label>
              <Textarea
                value={selectedNode.config.prompt || ''}
                onChange={(e) => onUpdateNode(selectedNode.id, { 
                  config: { ...selectedNode.config, prompt: e.target.value }
                })}
                placeholder="Enter the prompt for Gemini AI..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-300">Configuration</Label>
            <Textarea
              value={JSON.stringify(selectedNode.config, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value);
                  onUpdateNode(selectedNode.id, { config });
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              placeholder="Node configuration (JSON)"
              className="bg-slate-700/50 border-slate-600 text-white font-mono text-xs"
              rows={6}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeConfiguration;
