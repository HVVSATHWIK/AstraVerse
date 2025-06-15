
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Custom SVG Icons
const StepsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
    <path d="M8 12l4 0l4 0" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

const QuickStartGuide = () => {
  const steps = [
    {
      title: "Connect Your First App",
      description: "Link Zoom, Slack, or Jira to start automating",
      status: "pending",
      action: "Connect Now"
    },
    {
      title: "Record Your First Meeting",
      description: "Get AI transcription and smart summaries",
      status: "pending", 
      action: "Start Recording"
    },
    {
      title: "Create an Automation",
      description: "Set up your first AI workflow",
      status: "pending",
      action: "Build Workflow"
    },
    {
      title: "Review AI Insights",
      description: "See how AI is improving your productivity",
      status: "pending",
      action: "View Dashboard"
    }
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl" data-tutorial="quick-start-guide">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3 shadow-lg">
            <StepsIcon className="w-6 h-6 text-white" />
          </div>
          Quick Start Guide
          <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/50">Get Started</Badge>
        </CardTitle>
        <p className="text-slate-400 text-sm">Get the most out of AstraAI in 4 simple steps</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                {step.status === 'completed' ? (
                  <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <span className="text-slate-300 text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{step.title}</div>
                <div className="text-slate-400 text-xs">{step.description}</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="bg-slate-600/50 border-slate-500 text-slate-200 hover:bg-slate-500/50">
              <PlayIcon className="w-4 h-4 mr-1" />
              {step.action}
            </Button>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700/50">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            Complete Setup Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;
