import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Sliders, Code } from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';
import { nodeTypes } from '@/constants/nodeTypes';
import { Slider } from '@/components/ui/slider';

interface NodeConfigurationProps {
  selectedNode: WorkflowNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

const NodeConfiguration = ({ selectedNode, onUpdateNode }: NodeConfigurationProps) => {
  if (!selectedNode) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-white text-lg">Node Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Select a node to configure it</p>
            <p className="text-slate-500 text-sm mt-2">
              Click on any node in the canvas to view and edit its properties
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Settings className="w-5 h-5 mr-2 text-slate-400" />
          Node Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
        <Tabs defaultValue="basic">
          <TabsList className="bg-slate-700/50 w-full">
            <TabsTrigger value="basic" className="flex items-center">
              <Sliders className="w-4 h-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Node Name</Label>
              <Input
                value={selectedNode.name}
                onChange={(e) => onUpdateNode(selectedNode.id, { name: e.target.value })}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="Enter node name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Node Type</Label>
              <Select
                value={selectedNode.type}
                onValueChange={(value) => onUpdateNode(selectedNode.id, { type: value as any })}
                disabled
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
              <p className="text-xs text-slate-500 mt-1">Node type cannot be changed after creation</p>
            </div>

            {/* Render different configuration options based on node type */}
            {selectedNode.type === 'trigger' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Trigger Type</Label>
                  <Select
                    value={selectedNode.config.triggerType || 'manual'}
                    onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, triggerType: value }
                    })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="manual" className="text-white hover:bg-slate-700">Manual Trigger</SelectItem>
                      <SelectItem value="scheduled" className="text-white hover:bg-slate-700">Scheduled</SelectItem>
                      <SelectItem value="webhook" className="text-white hover:bg-slate-700">Webhook</SelectItem>
                      <SelectItem value="event" className="text-white hover:bg-slate-700">Event Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedNode.config.triggerType === 'scheduled' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Schedule</Label>
                    <Input
                      value={selectedNode.config.schedule || ''}
                      onChange={(e) => onUpdateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, schedule: e.target.value }
                      })}
                      placeholder="e.g., Every day at 9am"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                )}

                {selectedNode.config.triggerType === 'event' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Event Type</Label>
                    <Select
                      value={selectedNode.config.eventType || 'document_upload'}
                      onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, eventType: value }
                      })}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="document_upload" className="text-white hover:bg-slate-700">Document Upload</SelectItem>
                        <SelectItem value="meeting_ended" className="text-white hover:bg-slate-700">Meeting Ended</SelectItem>
                        <SelectItem value="form_submitted" className="text-white hover:bg-slate-700">Form Submitted</SelectItem>
                        <SelectItem value="email_received" className="text-white hover:bg-slate-700">Email Received</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {selectedNode.type === 'action' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Action Type</Label>
                  <Select
                    value={selectedNode.config.actionType || 'notification'}
                    onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, actionType: value }
                    })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="notification" className="text-white hover:bg-slate-700">Send Notification</SelectItem>
                      <SelectItem value="email" className="text-white hover:bg-slate-700">Send Email</SelectItem>
                      <SelectItem value="api_call" className="text-white hover:bg-slate-700">API Call</SelectItem>
                      <SelectItem value="data_transform" className="text-white hover:bg-slate-700">Data Transformation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedNode.config.actionType === 'notification' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Message</Label>
                    <Textarea
                      value={selectedNode.config.message || ''}
                      onChange={(e) => onUpdateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, message: e.target.value }
                      })}
                      placeholder="Enter notification message"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                )}

                {selectedNode.config.actionType === 'api_call' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-slate-300">API Endpoint</Label>
                      <Input
                        value={selectedNode.config.endpoint || ''}
                        onChange={(e) => onUpdateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, endpoint: e.target.value }
                        })}
                        placeholder="https://api.example.com/endpoint"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Method</Label>
                      <Select
                        value={selectedNode.config.method || 'GET'}
                        onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, method: value }
                        })}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="GET" className="text-white hover:bg-slate-700">GET</SelectItem>
                          <SelectItem value="POST" className="text-white hover:bg-slate-700">POST</SelectItem>
                          <SelectItem value="PUT" className="text-white hover:bg-slate-700">PUT</SelectItem>
                          <SelectItem value="DELETE" className="text-white hover:bg-slate-700">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedNode.type === 'condition' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Condition Type</Label>
                  <Select
                    value={selectedNode.config.conditionType || 'if_then'}
                    onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, conditionType: value }
                    })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="if_then" className="text-white hover:bg-slate-700">If-Then</SelectItem>
                      <SelectItem value="switch" className="text-white hover:bg-slate-700">Switch</SelectItem>
                      <SelectItem value="loop" className="text-white hover:bg-slate-700">Loop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedNode.config.conditionType === 'if_then' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Condition Expression</Label>
                    <Textarea
                      value={selectedNode.config.expression || ''}
                      onChange={(e) => onUpdateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, expression: e.target.value }
                      })}
                      placeholder="Enter condition (e.g., value > 10)"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            {selectedNode.type === 'gemini_ai' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">AI Action Type</Label>
                  <Select
                    value={selectedNode.config.aiType || 'generate'}
                    onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, aiType: value }
                    })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="generate" className="text-white hover:bg-slate-700">Generate Content</SelectItem>
                      <SelectItem value="analyze" className="text-white hover:bg-slate-700">Analyze Data</SelectItem>
                      <SelectItem value="summarize" className="text-white hover:bg-slate-700">Summarize Text</SelectItem>
                      <SelectItem value="extract" className="text-white hover:bg-slate-700">Extract Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Prompt</Label>
                  <Textarea
                    value={selectedNode.config.prompt || ''}
                    onChange={(e) => onUpdateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, prompt: e.target.value }
                    })}
                    placeholder="Enter AI prompt"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Temperature: {selectedNode.config.temperature || 0.7}
                  </Label>
                  <Slider
                    value={[selectedNode.config.temperature || 0.7]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => onUpdateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, temperature: value[0] }
                    })}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">
                    Controls randomness: 0 = deterministic, 1 = creative
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Raw Configuration (JSON)</Label>
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
                className="bg-slate-700/50 border-slate-600 text-white font-mono text-xs"
                rows={10}
              />
              <p className="text-xs text-slate-500">
                Edit the raw JSON configuration for advanced settings
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NodeConfiguration;