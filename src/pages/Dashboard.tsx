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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              AstraAI Platform
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Enterprise AI Orchestration & Intelligence</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleRealtime}
                className={`text-gray-700 border-gray-300 hover:bg-gray-50 ${!isRealtimeEnabled ? 'opacity-50' : ''}`}
              >
                {isConnected && isRealtimeEnabled ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
                {isRealtimeEnabled ? 'Live' : 'Paused'}
              </Button>
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        <ErrorBoundary>
          {kpisLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <Skeleton className="h-8 md:h-12 w-full mb-4" />
                    <Skeleton className="h-6 md:h-8 w-16 mb-2" />
                    <Skeleton className="h-3 md:h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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

        {/* Main Dashboard Tabs */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            <div className="hidden md:block">
              <TabsList className="bg-white border border-gray-200 shadow-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Workflows</TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Integrations</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Analytics</TabsTrigger>
                <TabsTrigger value="pilot" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Pilot Mode</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* AI Engines Status */}
                <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-gray-800 flex items-center text-sm md:text-base">
                      <Brain className="w-4 md:w-5 h-4 md:h-5 mr-2 text-blue-500" />
                      AI Engine Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    {aiEnginesLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24 md:w-32" />
                          <Skeleton className="h-5 md:h-6 w-12 md:w-16" />
                        </div>
                      ))
                    ) : (
                      aiEngines?.map((engine) => (
                        <div key={engine.id} className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm md:text-base">{engine.name}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              engine.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : engine.status === 'scaling'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {engine.status}
                          </Badge>
                        </div>
                      )) || (
                        // ... keep existing code (fallback AI engines display)
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Drools Engine</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">LLM Pipeline</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Multi-modal Processor</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Vector Embeddings</span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Scaling</Badge>
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

            <TabsContent value="workflows" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <WorkflowBuilder />
                <WorkflowControls />
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4 md:space-y-6">
              {/* ... keep existing code (integrations grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
              {/* ... keep existing code (pilot mode cards) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Basic Tier</CardTitle>
                    <CardDescription className="text-blue-700">
                      Transcription + Narrative Reporting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-bold text-blue-900">$99/month</div>
                    <ul className="space-y-2 text-blue-800">
                      <li>• Meeting transcription</li>
                      <li>• AI narrative reports</li>
                      <li>• Basic analytics</li>
                      <li>• 5 integrations</li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start Basic Pilot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-purple-900">Pro Tier</CardTitle>
                    <CardDescription className="text-purple-700">
                      + Autonomous Scheduling + Alerting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-bold text-purple-900">$299/month</div>
                    <ul className="space-y-2 text-purple-800">
                      <li>• All Basic features</li>
                      <li>• Smart scheduling</li>
                      <li>• Churn alerts</li>
                      <li>• Advanced workflows</li>
                    </ul>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Start Pro Pilot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-amber-900">Enterprise</CardTitle>
                    <CardDescription className="text-amber-700">
                      Full Orchestration + Custom LLM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-bold text-amber-900">Custom</div>
                    <ul className="space-y-2 text-amber-800">
                      <li>• All Pro features</li>
                      <li>• Custom LLM training</li>
                      <li>• On-premise deployment</li>
                      <li>• White-label options</li>
                    </ul>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
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
