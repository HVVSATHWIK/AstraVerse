
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Database, CheckCircle } from 'lucide-react';
import { useCreateWorkflow, useCreateIntegration, useLogActivity } from '@/services/dataService';
import { toast } from 'sonner';

const DemoDataSeeder = () => {
  const createWorkflow = useCreateWorkflow();
  const createIntegration = useCreateIntegration();
  const logActivity = useLogActivity();

  const seedDemoData = async () => {
    try {
      toast.info('Setting up your demo data...');

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

      for (const workflow of workflows) {
        await createWorkflow.mutateAsync(workflow);
      }

      // Create sample integrations
      const integrations = [
        {
          integration_type: 'email',
          name: 'Gmail Integration',
          config: {
            provider: 'gmail',
            settings: { auto_sync: true, labels: ['work', 'important'] }
          },
          enabled: true
        },
        {
          integration_type: 'calendar',
          name: 'Google Calendar',
          config: {
            provider: 'google_calendar',
            settings: { sync_frequency: '15min', timezone: 'UTC' }
          },
          enabled: true
        },
        {
          integration_type: 'storage',
          name: 'Dropbox Storage',
          config: {
            provider: 'dropbox',
            settings: { folder: '/AstraAI', auto_backup: true }
          },
          enabled: false
        }
      ];

      for (const integration of integrations) {
        await createIntegration.mutateAsync(integration);
      }

      // Log demo setup activity
      await logActivity.mutateAsync({
        action: 'demo_data_setup',
        description: 'Demo data successfully created for user account',
        metadata: {
          workflows_created: workflows.length,
          integrations_created: integrations.length,
          timestamp: new Date().toISOString()
        }
      });

      toast.success('Demo data has been set up successfully!');
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error('Failed to set up demo data. Please try again.');
    }
  };

  const isLoading = createWorkflow.isPending || createIntegration.isPending || logActivity.isPending;

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-purple-400" />
          <span>Demo Data Setup</span>
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

        <Button
          onClick={seedDemoData}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? 'Setting up...' : 'Setup Demo Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoDataSeeder;
