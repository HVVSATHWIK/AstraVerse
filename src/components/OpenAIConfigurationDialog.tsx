
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useCreateOpenAIConfigurationMutation, useUpdateOpenAIConfigurationMutation } from '@/hooks/api/useOpenAIApi';
import { OpenAIConfiguration } from '@/types/openai';
import { Settings, Plus } from 'lucide-react';

interface OpenAIConfigurationDialogProps {
  configuration?: OpenAIConfiguration;
  trigger?: React.ReactNode;
  onClose?: () => void;
}

const OpenAIConfigurationDialog = ({ configuration, trigger, onClose }: OpenAIConfigurationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    system_prompt: 'You are a helpful AI assistant.',
    is_active: true,
  });

  const createMutation = useCreateOpenAIConfigurationMutation();
  const updateMutation = useUpdateOpenAIConfigurationMutation();

  useEffect(() => {
    if (configuration) {
      setFormData({
        name: configuration.name,
        model: configuration.model,
        temperature: configuration.temperature,
        max_tokens: configuration.max_tokens,
        top_p: configuration.top_p,
        frequency_penalty: configuration.frequency_penalty,
        presence_penalty: configuration.presence_penalty,
        system_prompt: configuration.system_prompt || 'You are a helpful AI assistant.',
        is_active: configuration.is_active,
      });
    }
  }, [configuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (configuration) {
        await updateMutation.mutateAsync({
          id: configuration.id,
          updates: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      
      setOpen(false);
      onClose?.();
      
      // Reset form if creating new
      if (!configuration) {
        setFormData({
          name: '',
          model: 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          system_prompt: 'You are a helpful AI assistant.',
          is_active: true,
        });
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const modelOptions = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4.1-2025-04-14', label: 'GPT-4.1' },
  ];

  const defaultTrigger = (
    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
      {configuration ? (
        <>
          <Settings className="w-4 h-4 mr-2" />
          Edit Configuration
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          New Configuration
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {configuration ? 'Edit OpenAI Configuration' : 'Create OpenAI Configuration'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Configuration Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Creative Writing Assistant"
                className="bg-slate-700/50 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              placeholder="Define the AI's behavior and context..."
              className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Temperature: {formData.temperature}</Label>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-400">Controls creativity vs focus</p>
            </div>
            
            <div className="space-y-2">
              <Label>Max Tokens: {formData.max_tokens}</Label>
              <Slider
                value={[formData.max_tokens]}
                onValueChange={([value]) => setFormData({ ...formData, max_tokens: value })}
                max={4096}
                min={50}
                step={50}
                className="w-full"
              />
              <p className="text-xs text-slate-400">Maximum response length</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Top P: {formData.top_p}</Label>
              <Slider
                value={[formData.top_p]}
                onValueChange={([value]) => setFormData({ ...formData, top_p: value })}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Frequency Penalty: {formData.frequency_penalty}</Label>
              <Slider
                value={[formData.frequency_penalty]}
                onValueChange={([value]) => setFormData({ ...formData, frequency_penalty: value })}
                max={2}
                min={-2}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Presence Penalty: {formData.presence_penalty}</Label>
              <Slider
                value={[formData.presence_penalty]}
                onValueChange={([value]) => setFormData({ ...formData, presence_penalty: value })}
                max={2}
                min={-2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is-active">Active Configuration</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIConfigurationDialog;
