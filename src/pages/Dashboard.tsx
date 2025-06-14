
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Brain, 
  Database, 
  GitBranch, 
  MessageSquare, 
  Users, 
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';
import StatusCard from '@/components/StatusCard';
import IntegrationCard from '@/components/IntegrationCard';
import MetricsChart from '@/components/MetricsChart';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import ActivityFeed from '@/components/ActivityFeed';
import KPIOverview from '@/components/KPIOverview';
import WorkflowControls from '@/components/WorkflowControls';
import NotificationCenter from '@/components/NotificationCenter';
import MobileNav from '@/components/MobileNav';
import ErrorBoundary from '@/components/ErrorBoundary';
import AstraLogo from '@/components/AstraLogo';
import { RealtimeProvider, useRealtime } from '@/contexts/RealtimeContext';
import { useKPIs, useAIEngines, useActivityLogs } from '@/services/dataService';
import { Toaster } from '@/components/ui/toaster';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: aiEngines, isLoading: aiEnginesLoading } = useAIEngines();
  const { data: activityLogs, isLoading: activityLoading } = useActivityLogs(4);
  const { isConnected, toggleRealtime, isRealtimeEnabled } = useRealtime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Enhanced Header with Logo */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-4">
            <AstraLogo size="lg" className="animate-float" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                AstraAI Platform
              </h1>
              <p className="text-slate-600 text-base mt-1">Enterprise AI Orchestration & Intelligence</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              All Systems Operational
            </Badge>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleRealtime}
                className={`bg-white/80 border-slate-200 hover:bg-slate-50 transition-all duration-200 ${!isRealtimeEnabled ? 'opacity-60' : ''}`}
              >
                {isConnected && isRealtimeEnabled ? <Wifi className="w-4 h-4 mr-2 text-emerald-600" /> : <WifiOff className="w-4 h-4 mr-2 text-slate-400" />}
                {isRealtimeEnabled ? 'Live' : 'Paused'}
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80 border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        </div>

        {/* System Status Overview with Better Layout */}
        <ErrorBoundary>
          {kpisLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="AI Engines"
                value={`${kpis?.activeEngines || 4}/4`}
                status="healthy"
                icon={Brain}
                description="All AI models operational"
              />
              <StatusCard
                title="Active Workflows"
                value={kpis?.activeWorkflows?.toString() || "23"}
                status="healthy"
                icon={GitBranch}
                description="Real-time processing"
              />
              <StatusCard
                title="Data Throughput"
                value={kpis?.throughput || "1.2TB/h"}
                status={kpis?.throughputStatus || "warning"}
                icon={Database}
                description="95% capacity"
              />
              <StatusCard
                title="Response Time"
                value={`${kpis?.avgResponseTime || 147}ms`}
                status={kpis?.responseTimeStatus || "healthy"}
                icon={Clock}
                description="Avg latency"
              />
            </div>
          )}
        </ErrorBoundary>

        {/* Enhanced Main Dashboard Tabs */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="hidden md:block">
              <TabsList className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg p-1">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="workflows" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Workflows
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Integrations
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="pilot" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Pilot Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* AI Engines Status */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 flex items-center text-lg">
                      <Brain className="w-5 h-5 mr-3 text-indigo-600" />
                      AI Engine Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiEnginesLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))
                    ) : (
                      aiEngines?.map((engine) => (
                        <div key={engine.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                          <span className="text-slate-700 font-medium">{engine.name}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              engine.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : engine.status === 'scaling'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {engine.status}
                          </Badge>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                            <span className="text-slate-700 font-medium">Drools Engine</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                            <span className="text-slate-700 font-medium">LLM Pipeline</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                            <span className="text-slate-700 font-medium">Multi-modal Processor</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                            <span className="text-slate-700 font-medium">Vector Embeddings</span>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Scaling</Badge>
                          </div>
                        </>
                      )
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <ActivityFeed activities={activityLogs} isLoading={activityLoading} />

                {/* Notification Center */}
                <NotificationCenter />
              </div>

              {/* Performance Metrics */}
              <MetricsChart />
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <WorkflowBuilder />
                <WorkflowControls />
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <IntegrationCard
                  name="Zoom"
                  description="Video transcription and meeting insights"
                  status="connected"
                  icon="🎥"
                  metrics={{ meetings: 45, transcriptions: 42 }}
                />
                <IntegrationCard
                  name="Slack"
                  description="Real-time notifications and slash commands"
                  status="connected"
                  icon="💬"
                  metrics={{ channels: 12, notifications: 156 }}
                />
                <IntegrationCard
                  name="Jira"
                  description="Automated ticket creation and updates"
                  status="connected"
                  icon="📋"
                  metrics={{ tickets: 23, automated: 18 }}
                />
                <IntegrationCard
                  name="MongoDB"
                  description="Metadata and document storage"
                  status="connected"
                  icon="🗄️"
                  metrics={{ documents: "2.3M", size: "45GB" }}
                />
                <IntegrationCard
                  name="InfluxDB"
                  description="Time-series metrics and analytics"
                  status="connected"
                  icon="📊"
                  metrics={{ points: "890K", queries: 1200 }}
                />
                <IntegrationCard
                  name="Milvus"
                  description="Vector embeddings and similarity search"
                  status="warning"
                  icon="🔍"
                  metrics={{ vectors: "1.2M", searches: 450 }}
                />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <KPIOverview />
            </TabsContent>

            <TabsContent value="pilot">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-indigo-900">Basic Tier</CardTitle>
                    <CardDescription className="text-indigo-700">
                      Transcription + Narrative Reporting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-indigo-900">$99/month</div>
                    <ul className="space-y-2 text-indigo-800">
                      <li>• Meeting transcription</li>
                      <li>• AI narrative reports</li>
                      <li>• Basic analytics</li>
                      <li>• 5 integrations</li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Basic Pilot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-purple-900">Pro Tier</CardTitle>
                    <CardDescription className="text-purple-700">
                      + Autonomous Scheduling + Alerting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-purple-900">$299/month</div>
                    <ul className="space-y-2 text-purple-800">
                      <li>• All Basic features</li>
                      <li>• Smart scheduling</li>
                      <li>• Churn alerts</li>
                      <li>• Advanced workflows</li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Pro Pilot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-emerald-900">Enterprise</CardTitle>
                    <CardDescription className="text-emerald-700">
                      Full Orchestration + Custom LLM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-emerald-900">Custom</div>
                    <ul className="space-y-2 text-emerald-800">
                      <li>• All Pro features</li>
                      <li>• Custom LLM training</li>
                      <li>• On-premise deployment</li>
                      <li>• White-label options</li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Contact Sales
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </div>
      <Toaster />
    </div>
  );
};

const Dashboard = () => {
  return (
    <RealtimeProvider>
      <DashboardContent />
    </RealtimeProvider>
  );
};

export default Dashboard;
