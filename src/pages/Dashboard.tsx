
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Settings
} from 'lucide-react';
import StatusCard from '@/components/StatusCard';
import IntegrationCard from '@/components/IntegrationCard';
import MetricsChart from '@/components/MetricsChart';
import WorkflowBuilder from '@/components/WorkflowBuilder';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AstraAI Platform</h1>
            <p className="text-slate-300">Enterprise AI Orchestration & Intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-800">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="AI Engines"
            value="4/4"
            status="healthy"
            icon={Brain}
            description="All AI models operational"
          />
          <StatusCard
            title="Active Workflows"
            value="23"
            status="healthy"
            icon={GitBranch}
            description="Real-time processing"
          />
          <StatusCard
            title="Data Throughput"
            value="1.2TB/h"
            status="warning"
            icon={Database}
            description="95% capacity"
          />
          <StatusCard
            title="Response Time"
            value="147ms"
            status="healthy"
            icon={Clock}
            description="Avg latency"
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="workflows" className="data-[state=active]:bg-purple-600">Workflows</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-purple-600">Integrations</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            <TabsTrigger value="pilot" className="data-[state=active]:bg-purple-600">Pilot Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Engines Status */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Engine Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Drools Engine</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">LLM Pipeline</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Multi-modal Processor</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Vector Embeddings</span>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">Scaling</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Zoom meeting transcribed and analyzed</span>
                    <span className="text-slate-500 text-xs">2m ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Slack alert triggered for customer churn</span>
                    <span className="text-slate-500 text-xs">5m ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Jira ticket auto-created from analysis</span>
                    <span className="text-slate-500 text-xs">12m ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Weekly report generated</span>
                    <span className="text-slate-500 text-xs">1h ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <MetricsChart />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowBuilder />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">KPI Dashboard</CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Meeting Reduction</span>
                      <span className="text-green-400">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Task Completion Rate</span>
                      <span className="text-blue-400">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Response Latency</span>
                      <span className="text-purple-400">147ms</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Resource Utilization</CardTitle>
                  <CardDescription className="text-slate-400">
                    System performance overview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">CPU Usage</span>
                      <span className="text-yellow-400">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Memory Usage</span>
                      <span className="text-red-400">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Storage</span>
                      <span className="text-blue-400">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pilot">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Basic Tier</CardTitle>
                  <CardDescription className="text-blue-200">
                    Transcription + Narrative Reporting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-white">$99/month</div>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Meeting transcription</li>
                    <li>• AI narrative reports</li>
                    <li>• Basic analytics</li>
                    <li>• 5 integrations</li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Basic Pilot
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Pro Tier</CardTitle>
                  <CardDescription className="text-purple-200">
                    + Autonomous Scheduling + Alerting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-white">$299/month</div>
                  <ul className="space-y-2 text-purple-100">
                    <li>• All Basic features</li>
                    <li>• Smart scheduling</li>
                    <li>• Churn alerts</li>
                    <li>• Advanced workflows</li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Pro Pilot
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border-amber-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise</CardTitle>
                  <CardDescription className="text-amber-200">
                    Full Orchestration + Custom LLM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-white">Custom</div>
                  <ul className="space-y-2 text-amber-100">
                    <li>• All Pro features</li>
                    <li>• Custom LLM training</li>
                    <li>• On-premise deployment</li>
                    <li>• White-label options</li>
                  </ul>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
