
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Custom SVG Icons for main features
const MeetingIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M7 8l5 3 5-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    <path d="M2 8l20 0" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const AutomationIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 2v20M8 9l8 0M8 13l8 0M8 17l4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="7" r="1" fill="currentColor" className="animate-pulse" />
  </svg>
);

const IntegrationIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 8l6 6M16 8l-6 6M8 16l6-6M16 16l-6-6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const MainFeatures = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Meeting Intelligence */}
      <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/30 backdrop-blur-sm hover:from-blue-600/20 hover:to-blue-800/20 transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4 w-fit">
            <MeetingIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Meeting Intelligence</CardTitle>
          <p className="text-blue-200 text-sm">Transform meetings into actionable insights</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-100 text-sm">Auto Transcription</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100 text-sm">AI Summaries</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Real-time</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100 text-sm">Action Items</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Auto-generated</Badge>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Start Recording
          </Button>
        </CardContent>
      </Card>

      {/* Workflow Automation */}
      <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/30 backdrop-blur-sm hover:from-purple-600/20 hover:to-purple-800/20 transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg mb-4 w-fit">
            <AutomationIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Smart Automation</CardTitle>
          <p className="text-purple-200 text-sm">AI-powered workflow orchestration</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Active Workflows</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">23 Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Tasks Automated</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">1,247 Today</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Success Rate</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">98.7%</Badge>
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Create Workflow
          </Button>
        </CardContent>
      </Card>

      {/* Integrations Hub */}
      <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/30 backdrop-blur-sm hover:from-orange-600/20 hover:to-orange-800/20 transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4 w-fit">
            <IntegrationIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Connected Apps</CardTitle>
          <p className="text-orange-200 text-sm">Seamless integrations with your tools</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-orange-100 text-sm">Zoom Meetings</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-100 text-sm">Slack Workspace</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Syncing</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-100 text-sm">Jira Projects</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">12 Active</Badge>
            </div>
          </div>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            Add Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainFeatures;
