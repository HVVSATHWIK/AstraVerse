
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Custom SVG Icons
const EnergyIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="white" opacity="0.8" />
  </svg>
);

const CreateIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PlayIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M8 5v14l11-7z" fill="currentColor" />
    <circle cx="8" cy="12" r="1" fill="white" opacity="0.7" />
  </svg>
);

const SyncIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 8h4v4M7 16H3v-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 3v12M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnalyticsIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M7 14l3-3 2 2 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="14" r="1" fill="currentColor" />
    <circle cx="10" cy="11" r="1" fill="currentColor" />
    <circle cx="12" cy="13" r="1" fill="currentColor" />
    <circle cx="17" cy="8" r="1" fill="currentColor" />
  </svg>
);

const UsersIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuickActions = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg mr-3 shadow-lg">
            <EnergyIcon className="w-5 h-5 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <CreateIcon className="w-3 h-3 mr-2" />
            New Workflow
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
            <PlayIcon className="w-3 h-3 mr-2" />
            Run Test
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
            <SyncIcon className="w-3 h-3 mr-2" />
            Sync Data
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
            <DownloadIcon className="w-3 h-3 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="pt-3 border-t border-slate-700/50">
          <div className="text-slate-300 text-sm mb-3 font-medium">System Controls</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
              <div className="flex items-center">
                <AnalyticsIcon className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-slate-200 text-sm">Analytics Engine</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
              <div className="flex items-center">
                <UsersIcon className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-slate-200 text-sm">User Sessions</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                142 Active
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
