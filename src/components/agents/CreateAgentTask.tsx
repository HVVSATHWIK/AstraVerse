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
import { useCreateAgentTaskMutation } from '@/hooks/useAgentService';

const taskSchema = z.object({
  agentId: z.string().uuid('Invalid agent ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  type: z.enum(['analysis', 'processing', 'monitoring', 'automation']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateAgentTaskProps {
  agentId: string;
  onSuccess?: () => void;
}

const CreateAgentTask = ({ agentId, onSuccess }: CreateAgentTaskProps) => {
  const createTaskMutation = useCreateAgentTaskMutation();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      agentId,
      title: '',
      description: '',
      type: 'processing',
      priority: 'medium',
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await createTaskMutation.mutateAsync({
        agentId: values.agentId,
        title: values.title,
        description: values.description,
        type: values.type,
        priority: values.priority,
      });
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Task Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter task title"
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
                  <FormLabel className="text-slate-300">Task Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="analysis" className="text-white hover:bg-slate-700">Analysis</SelectItem>
                      <SelectItem value="processing" className="text-white hover:bg-slate-700">Processing</SelectItem>
                      <SelectItem value="monitoring" className="text-white hover:bg-slate-700">Monitoring</SelectItem>
                      <SelectItem value="automation" className="text-white hover:bg-slate-700">Automation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low" className="text-white hover:bg-slate-700">Low</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-slate-700">Medium</SelectItem>
                      <SelectItem value="high" className="text-white hover:bg-slate-700">High</SelectItem>
                      <SelectItem value="urgent" className="text-white hover:bg-slate-700">Urgent</SelectItem>
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
                      placeholder="Describe the task"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAgentTask;