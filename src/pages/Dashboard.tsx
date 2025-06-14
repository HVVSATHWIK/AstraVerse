
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
  WifiOff,
  BarChart3
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Clean Header */}
        <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-4">
            <AstraLogo size="md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AstraAI Platform</h1>
              <p className="text-gray-600">Enterprise AI Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRealtime}
              className="border-gray-200"
            >
              {isConnected && isRealtimeEnabled ? <Wifi className="w-4 h-4 mr-2 text-green-600" /> : <WifiOff className="w-4 h-4 mr-2 text-gray-400" />}
              {isRealtimeEnabled ? 'Live' : 'Paused'}
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {/* Status Cards - Simplified */}
        <ErrorBoundary>
          {kpisLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="w-8 h-8 text-blue-600" />
                    <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">AI Engines</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis?.activeEngines || 4}/4</p>
                    <p className="text-xs text-gray-500">All systems operational</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <GitBranch className="w-8 h-8 text-purple-600" />
                    <Badge className="bg-green-100 text-green-800 border-green-200">Running</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis?.activeWorkflows?.toString() || "23"}</p>
                    <p className="text-xs text-gray-500">Real-time processing</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Database className="w-8 h-8 text-orange-600" />
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">High</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Data Throughput</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis?.throughput || "1.2TB/h"}</p>
                    <p className="text-xs text-gray-500">95% capacity</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-green-600" />
                    <Badge className="bg-green-100 text-green-800 border-green-200">Optimal</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis?.avgResponseTime || 147}ms</p>
                    <p className="text-xs text-gray-500">Average latency</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ErrorBoundary>

        {/* Main Tabs - Cleaner Design */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="hidden md:block">
              <TabsList className="bg-white border border-gray-200 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="pilot" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Pilot Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* AI Engines Status - Simplified */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-900 text-lg flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-600" />
                      AI Engine Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiEnginesLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))
                    ) : (
                      aiEngines?.map((engine) => (
                        <div key={engine.id} className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50">
                          <span className="text-gray-700 font-medium">{engine.name}</span>
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
                        <>
                          <div className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50">
                            <span className="text-gray-700 font-medium">Drools Engine</span>
                            <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50">
                            <span className="text-gray-700 font-medium">LLM Pipeline</span>
                            <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50">
                            <span className="text-gray-700 font-medium">Multi-modal Processor</span>
                            <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50">
                            <span className="text-gray-700 font-medium">Vector Embeddings</span>
                            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Scaling</Badge>
                          </div>
                        </>
                      )
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity - Clean Design */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-900 text-lg flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activityLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3">
                          <Skeleton className="w-2 h-2 rounded-full" />
                          <Skeleton className="h-4 flex-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm flex-1">Zoom meeting transcribed</span>
                          <span className="text-gray-500 text-xs">2m ago</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm flex-1">Slack alert triggered</span>
                          <span className="text-gray-500 text-xs">5m ago</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm flex-1">Jira ticket created</span>
                          <span className="text-gray-500 text-xs">12m ago</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm flex-1">Weekly report generated</span>
                          <span className="text-gray-500 text-xs">1h ago</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-900 text-lg flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">CPU Usage</span>
                        <span className="text-gray-900 font-medium">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Memory Usage</span>
                        <span className="text-gray-900 font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Storage</span>
                        <span className="text-gray-900 font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Network I/O</span>
                        <span className="text-gray-900 font-medium">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
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
                <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Basic Tier</CardTitle>
                    <CardDescription className="text-gray-600">
                      Transcription + Narrative Reporting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-gray-900">$99/month</div>
                    <ul className="space-y-2 text-gray-700">
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

                <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Pro Tier</CardTitle>
                    <CardDescription className="text-gray-600">
                      + Autonomous Scheduling + Alerting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-gray-900">$299/month</div>
                    <ul className="space-y-2 text-gray-700">
                      <li>• All Basic features</li>
                      <li>• Smart scheduling</li>
                      <li>• Churn alerts</li>
                      <li>• Advanced workflows</li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start Pro Pilot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Enterprise</CardTitle>
                    <CardDescription className="text-gray-600">
                      Full Orchestration + Custom LLM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-gray-900">Custom</div>
                    <ul className="space-y-2 text-gray-700">
                      <li>• All Pro features</li>
                      <li>• Custom LLM training</li>
                      <li>• On-premise deployment</li>
                      <li>• White-label options</li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
