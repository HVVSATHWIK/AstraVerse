
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateWorkflow, useCreateIntegration, useLogActivity } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

const DemoDataSeeder = () => {
  const createWorkflow = useCreateWorkflow();
  const createIntegration = useCreateIntegration();
  const logActivity = useLogActivity();

  const seedDemoData = async () => {
    try {
      console.log('Starting demo data setup...');
      toast({
        title: 'Setting up demo data...',
        description: 'This may take a few moments',
      });

      // Create sample workflows
      const workflows = [
        {
          name: 'Email Automation',
          description: 'Automatically process and categorize incoming emails',
          config: {
            triggers: ['email_received'],
            actions: ['categorize', 'auto_reply'],
            settings: { auto_reply: true }
          }
        },
        {
          name: 'Document Processing',
          description: 'Extract and analyze data from uploaded documents',
          config: {
            triggers: ['document_upload'],
            actions: ['extract_text', 'analyze_content'],
            settings: { output_format: 'json' }
          }
        },
        {
          name: 'Meeting Transcription',
          description: 'Transcribe and summarize meeting recordings',
          config: {
            triggers: ['meeting_ended'],
            actions: ['transcribe', 'summarize', 'send_summary'],
            settings: { language: 'en', format: 'markdown' }
          }
        }
      ];

      console.log('Creating workflows...');
      for (const workflow of workflows) {
        console.log('Creating workflow:', workflow);
        const result = await createWorkflow.mutateAsync(workflow);
        console.log('Workflow created:', result);
      }

      // Create sample integrations
      const integrations = [
        {
          integration_type: 'email' as const,
          name: 'Gmail Integration',
          config: {
            provider: 'gmail',
            settings: { auto_sync: true, labels: ['work', 'important'] }
          },
          enabled: true
        },
        {
          integration_type: 'calendar' as const,
          name: 'Google Calendar',
          config: {
            provider: 'google_calendar',
            settings: { sync_frequency: '15min', timezone: 'UTC' }
          },
          enabled: true
        },
        {
          integration_type: 'storage' as const,
          name: 'Dropbox Storage',
          config: {
            provider: 'dropbox',
            settings: { folder: '/AstraAI', auto_backup: true }
          },
          enabled: false
        }
      ];

      console.log('Creating integrations...');
      for (const integration of integrations) {
        console.log('Creating integration:', integration);
        const result = await createIntegration.mutateAsync(integration);
        console.log('Integration created:', result);
      }

      // Log demo setup activity
      console.log('Logging activity...');
      const activityResult = await logActivity.mutateAsync({
        action: 'demo_data_setup',
        description: 'Demo data successfully created for user account',
        metadata: {
          workflows_created: workflows.length,
          integrations_created: integrations.length,
          timestamp: new Date().toISOString()
        }
      });
      console.log('Activity logged:', activityResult);

      toast({
        title: 'Demo data setup complete!',
        description: `Created ${workflows.length} workflows and ${integrations.length} integrations`,
      });
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast({
        title: 'Demo data setup failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const isLoading = createWorkflow.isPending || createIntegration.isPending || logActivity.isPending;

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 dark:bg-gradient-to-br dark:from-purple-900/30 dark:to-blue-900/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-purple-400" />
          <span>Demo Data Setup</span>
          {isLoading && <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm">
          Get started quickly by populating your account with sample workflows, integrations, and activity logs.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>3 Sample Workflows</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>3 Integrations</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Activity Logs</span>
          </div>
        </div>

        {(createWorkflow.isError || createIntegration.isError || logActivity.isError) && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Error occurred during setup. Please try again.</span>
          </div>
        )}

        <Button
          onClick={seedDemoData}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? 'Setting up...' : 'Setup Demo Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoDataSeeder;
