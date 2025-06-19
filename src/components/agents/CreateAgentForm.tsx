import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateAgentMutation } from '@/hooks/useAgentService';

const agentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['assistant', 'analyzer', 'executor', 'monitor']),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  capabilities: z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentSchema>;

interface CreateAgentFormProps {
  onSuccess?: () => void;
}

const CreateAgentForm = ({ onSuccess }: CreateAgentFormProps) => {
  const createAgentMutation = useCreateAgentMutation();

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: '',
      type: 'assistant',
      description: '',
      capabilities: '',
    },
  });

  const onSubmit = async (values: AgentFormValues) => {
    try {
      await createAgentMutation.mutateAsync({
        name: values.name,
        type: values.type,
        description: values.description,
        capabilities: values.capabilities ? values.capabilities.split(',').map(c => c.trim()) : [],
        status: 'idle',
      });
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Create New Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Agent Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter agent name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Agent Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="assistant" className="text-white hover:bg-slate-700">Assistant</SelectItem>
                      <SelectItem value="analyzer" className="text-white hover:bg-slate-700">Analyzer</SelectItem>
                      <SelectItem value="executor" className="text-white hover:bg-slate-700">Executor</SelectItem>
                      <SelectItem value="monitor" className="text-white hover:bg-slate-700">Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe what this agent does"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Capabilities (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., transcription, sentiment-analysis, summarization"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={createAgentMutation.isPending}
            >
              {createAgentMutation.isPending ? 'Creating...' : 'Create Agent'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAgentForm;