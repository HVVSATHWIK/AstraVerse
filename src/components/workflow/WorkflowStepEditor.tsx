import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Save, 
  Play, 
  Trash2, 
  Settings, 
  ArrowDown, 
  Zap, 
  Workflow, 
  GitBranch,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Workflow } from '@/types';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai';
  name: string;
  description?: string;
  config: Record<string, any>;
}

interface WorkflowStepEditorProps {
  workflow?: Workflow;
  onSave: (workflow: {
    name: string;
    description: string;
    status: 'draft' | 'active' | 'paused';
    steps: WorkflowStep[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const WorkflowStepEditor: React.FC<WorkflowStepEditorProps> = ({
  workflow,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'active' | 'paused'>(
    (workflow?.status as any) || 'draft'
  );
  const [steps, setSteps] = useState<WorkflowStep[]>(
    workflow?.steps || []
  );
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [currentStepType, setCurrentStepType] = useState<'trigger' | 'action' | 'condition' | 'ai'>('trigger');
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepName, setStepName] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [stepConfig, setStepConfig] = useState<Record<string, any>>({});

  const { toast } = useToast();

  const handleAddStep = (type: 'trigger' | 'action' | 'condition' | 'ai') => {
    setCurrentStepType(type);
    setStepName(`New ${type}`);
    setStepDescription('');
    setStepConfig({});
    setEditingStepIndex(null);
    setIsStepDialogOpen(true);
  };

  const handleEditStep = (index: number) => {
    const step = steps[index];
    setCurrentStepType(step.type);
    setStepName(step.name);
    setStepDescription(step.description || '');
    setStepConfig(step.config || {});
    setEditingStepIndex(index);
    setIsStepDialogOpen(true);
  };

  const handleSaveStep = () => {
    if (!stepName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Step name is required',
        variant: 'destructive',
      });
      return;
    }

    const newStep: WorkflowStep = {
      id: editingStepIndex !== null ? steps[editingStepIndex].id : `step-${Date.now()}`,
      type: currentStepType,
      name: stepName,
      description: stepDescription,
      config: stepConfig,
    };

    if (editingStepIndex !== null) {
      // Update existing step
      const newSteps = [...steps];
      newSteps[editingStepIndex] = newStep;
      setSteps(newSteps);
    } else {
      // Add new step
      setSteps([...steps, newStep]);
    }

    setIsStepDialogOpen(false);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Workflow name is required',
        variant: 'destructive',
      });
      return;
    }

    onSave({
      name: workflowName,
      description: workflowDescription,
      status: workflowStatus,
      steps,
    });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'action':
        return <Workflow className="w-4 h-4 text-green-400" />;
      case 'condition':
        return <GitBranch className="w-4 h-4 text-purple-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      default:
        return <Settings className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'action':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'condition':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'ai':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const renderStepConfigFields = () => {
    switch (currentStepType) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Trigger Type</Label>
              <Select
                value={stepConfig.triggerType || 'manual'}
                onValueChange={(value) => setStepConfig({ ...stepConfig, triggerType: value })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="manual" className="text-white hover:bg-slate-700">Manual Trigger</SelectItem>
                  <SelectItem value="scheduled" className="text-white hover:bg-slate-700">Scheduled</SelectItem>
                  <SelectItem value="webhook" className="text-white hover:bg-slate-700">Webhook</SelectItem>
                  <SelectItem value="event" className="text-white hover:bg-slate-700">Event Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {stepConfig.triggerType === 'scheduled' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Schedule</Label>
                <Input
                  value={stepConfig.schedule || ''}
                  onChange={(e) => setStepConfig({ ...stepConfig, schedule: e.target.value })}
                  placeholder="e.g., Every day at 9am"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            )}

            {stepConfig.triggerType === 'webhook' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Webhook URL</Label>
                <Input
                  value={stepConfig.webhookUrl || ''}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  readOnly
                  placeholder="Webhook URL will be generated after saving"
                />
              </div>
            )}

            {stepConfig.triggerType === 'event' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Event Type</Label>
                <Select
                  value={stepConfig.eventType || 'meeting_ended'}
                  onValueChange={(value) => setStepConfig({ ...stepConfig, eventType: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="meeting_ended" className="text-white hover:bg-slate-700">Meeting Ended</SelectItem>
                    <SelectItem value="document_uploaded" className="text-white hover:bg-slate-700">Document Uploaded</SelectItem>
                    <SelectItem value="form_submitted" className="text-white hover:bg-slate-700">Form Submitted</SelectItem>
                    <SelectItem value="email_received" className="text-white hover:bg-slate-700">Email Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Action Type</Label>
              <Select
                value={stepConfig.actionType || 'notification'}
                onValueChange={(value) => setStepConfig({ ...stepConfig, actionType: value })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="notification" className="text-white hover:bg-slate-700">Send Notification</SelectItem>
                  <SelectItem value="email" className="text-white hover:bg-slate-700">Send Email</SelectItem>
                  <SelectItem value="api_call" className="text-white hover:bg-slate-700">API Call</SelectItem>
                  <SelectItem value="data_transform" className="text-white hover:bg-slate-700">Transform Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {stepConfig.actionType === 'notification' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Notification Message</Label>
                <Textarea
                  value={stepConfig.message || ''}
                  onChange={(e) => setStepConfig({ ...stepConfig, message: e.target.value })}
                  placeholder="Enter notification message"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            )}

            {stepConfig.actionType === 'email' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Recipient</Label>
                  <Input
                    value={stepConfig.recipient || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, recipient: e.target.value })}
                    placeholder="Enter email recipient"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Subject</Label>
                  <Input
                    value={stepConfig.subject || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, subject: e.target.value })}
                    placeholder="Enter email subject"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Body</Label>
                  <Textarea
                    value={stepConfig.body || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, body: e.target.value })}
                    placeholder="Enter email body"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </>
            )}

            {stepConfig.actionType === 'api_call' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">API Endpoint</Label>
                  <Input
                    value={stepConfig.endpoint || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, endpoint: e.target.value })}
                    placeholder="Enter API endpoint"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Method</Label>
                  <Select
                    value={stepConfig.method || 'GET'}
                    onValueChange={(value) => setStepConfig({ ...stepConfig, method: value })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="GET" className="text-white hover:bg-slate-700">GET</SelectItem>
                      <SelectItem value="POST" className="text-white hover:bg-slate-700">POST</SelectItem>
                      <SelectItem value="PUT" className="text-white hover:bg-slate-700">PUT</SelectItem>
                      <SelectItem value="DELETE" className="text-white hover:bg-slate-700">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Payload (JSON)</Label>
                  <Textarea
                    value={stepConfig.payload || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, payload: e.target.value })}
                    placeholder='{"key": "value"}'
                    className="bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Condition Type</Label>
              <Select
                value={stepConfig.conditionType || 'if_then'}
                onValueChange={(value) => setStepConfig({ ...stepConfig, conditionType: value })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="if_then" className="text-white hover:bg-slate-700">If-Then</SelectItem>
                  <SelectItem value="switch" className="text-white hover:bg-slate-700">Switch</SelectItem>
                  <SelectItem value="loop" className="text-white hover:bg-slate-700">Loop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {stepConfig.conditionType === 'if_then' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Condition Expression</Label>
                  <Textarea
                    value={stepConfig.expression || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, expression: e.target.value })}
                    placeholder="Enter condition (e.g., value > 10)"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </>
            )}

            {stepConfig.conditionType === 'switch' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Switch Variable</Label>
                  <Input
                    value={stepConfig.variable || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, variable: e.target.value })}
                    placeholder="Enter variable name"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Cases (one per line)</Label>
                  <Textarea
                    value={stepConfig.cases || ''}
                    onChange={(e) => setStepConfig({ ...stepConfig, cases: e.target.value })}
                    placeholder="value1: action1\nvalue2: action2"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">AI Action Type</Label>
              <Select
                value={stepConfig.aiType || 'generate'}
                onValueChange={(value) => setStepConfig({ ...stepConfig, aiType: value })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select AI action type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
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
                value={stepConfig.prompt || ''}
                onChange={(e) => setStepConfig({ ...stepConfig, prompt: e.target.value })}
                placeholder="Enter AI prompt"
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Model</Label>
              <Select
                value={stepConfig.model || 'gemini-1.5-flash'}
                onValueChange={(value) => setStepConfig({ ...stepConfig, model: value })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="gemini-1.5-flash" className="text-white hover:bg-slate-700">Gemini 1.5 Flash</SelectItem>
                  <SelectItem value="gemini-1.5-pro" className="text-white hover:bg-slate-700">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="claude-3-opus" className="text-white hover:bg-slate-700">Claude 3 Opus</SelectItem>
                  <SelectItem value="gpt-4o" className="text-white hover:bg-slate-700">GPT-4o</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Temperature</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={stepConfig.temperature || 0.7}
                onChange={(e) => setStepConfig({ ...stepConfig, temperature: parseFloat(e.target.value) })}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400">Controls randomness (0 = deterministic, 1 = creative)</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">
          {workflow ? 'Edit Workflow' : 'Create New Workflow'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Workflow Name</Label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select
              value={workflowStatus}
              onValueChange={(value: 'draft' | 'active' | 'paused') => setWorkflowStatus(value)}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="draft" className="text-white hover:bg-slate-700">Draft</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-slate-700">Active</SelectItem>
                <SelectItem value="paused" className="text-white hover:bg-slate-700">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Description</Label>
          <Textarea
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            placeholder="Describe what this workflow does"
            className="bg-slate-700/50 border-slate-600 text-white"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Workflow Steps</Label>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddStep('trigger')}
                className="text-blue-400 border-blue-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Trigger
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddStep('action')}
                className="text-green-400 border-green-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Action
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddStep('condition')}
                className="text-purple-400 border-purple-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Condition
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddStep('ai')}
                className="text-yellow-400 border-yellow-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                AI
              </Button>
            </div>
          </div>

          {steps.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-slate-600 rounded-lg">
              <p className="text-slate-400 mb-4">Add steps to your workflow using the buttons above</p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddStep('trigger')}
                  className="text-blue-400 border-blue-500/50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Step
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                    <div className="flex-shrink-0">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStepColor(step.type)}>
                          {step.type}
                        </Badge>
                        <span className="text-white font-medium">{step.name}</span>
                      </div>
                      {step.description && (
                        <p className="text-slate-400 text-sm mt-1">{step.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStep(index)}
                        className="text-slate-300 hover:text-white"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveStep(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowDown className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-slate-300 border-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveWorkflow}
            disabled={!workflowName.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </CardContent>

      {/* Step Configuration Dialog */}
      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingStepIndex !== null ? 'Edit Step' : 'Add New Step'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Step Name</Label>
              <Input
                value={stepName}
                onChange={(e) => setStepName(e.target.value)}
                placeholder="Enter step name"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Description (Optional)</Label>
              <Textarea
                value={stepDescription}
                onChange={(e) => setStepDescription(e.target.value)}
                placeholder="Describe what this step does"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <Tabs defaultValue="config" className="w-full">
              <TabsList className="bg-slate-700/50">
                <TabsTrigger value="config" className="text-slate-300">Configuration</TabsTrigger>
                <TabsTrigger value="advanced" className="text-slate-300">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="config" className="space-y-4 mt-4">
                {renderStepConfigFields()}
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Raw Configuration (JSON)</Label>
                  <Textarea
                    value={JSON.stringify(stepConfig, null, 2)}
                    onChange={(e) => {
                      try {
                        setStepConfig(JSON.parse(e.target.value));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    className="bg-slate-700/50 border-slate-600 text-white font-mono text-xs"
                    rows={10}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsStepDialogOpen(false)}
                className="text-slate-300 border-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveStep}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkflowStepEditor;