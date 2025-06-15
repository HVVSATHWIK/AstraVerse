
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Zap, 
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Sample data for various analytics
  const performanceData = [
    { name: 'Mon', workflows: 45, ai_calls: 120, success_rate: 98 },
    { name: 'Tue', workflows: 52, ai_calls: 140, success_rate: 97 },
    { name: 'Wed', workflows: 48, ai_calls: 135, success_rate: 99 },
    { name: 'Thu', workflows: 61, ai_calls: 160, success_rate: 96 },
    { name: 'Fri', workflows: 55, ai_calls: 155, success_rate: 98 },
    { name: 'Sat', workflows: 32, ai_calls: 85, success_rate: 99 },
    { name: 'Sun', workflows: 28, ai_calls: 75, success_rate: 97 }
  ];

  const usageDistribution = [
    { name: 'Document Processing', value: 35, color: '#8884d8' },
    { name: 'Chat Workflows', value: 28, color: '#82ca9d' },
    { name: 'Meeting Automation', value: 20, color: '#ffc658' },
    { name: 'Data Analysis', value: 17, color: '#ff7300' }
  ];

  const realTimeMetrics = [
    { 
      label: 'Active Workflows', 
      value: '24', 
      change: '+12%', 
      trend: 'up',
      icon: Activity,
      color: 'text-blue-400'
    },
    { 
      label: 'AI API Calls', 
      value: '1,247', 
      change: '+8%', 
      trend: 'up',
      icon: Zap,
      color: 'text-purple-400'
    },
    { 
      label: 'Success Rate', 
      value: '98.2%', 
      change: '+0.5%', 
      trend: 'up',
      icon: Target,
      color: 'text-green-400'
    },
    { 
      label: 'Avg Response Time', 
      value: '1.2s', 
      change: '-0.3s', 
      trend: 'down',
      icon: Clock,
      color: 'text-yellow-400'
    }
  ];

  const errorAnalysis = [
    { type: 'API Timeout', count: 5, percentage: 45, status: 'high' },
    { type: 'Authentication Error', count: 3, percentage: 27, status: 'medium' },
    { type: 'Rate Limit Exceeded', count: 2, percentage: 18, status: 'medium' },
    { type: 'Invalid Input', count: 1, percentage: 10, status: 'low' }
  ];

  const userEngagement = [
    { hour: '00', active_users: 12, sessions: 45 },
    { hour: '04', active_users: 8, sessions: 25 },
    { hour: '08', active_users: 35, sessions: 120 },
    { hour: '12', active_users: 52, sessions: 180 },
    { hour: '16', active_users: 48, sessions: 165 },
    { hour: '20', active_users: 28, sessions: 95 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="1d" className="text-white hover:bg-slate-700">Last 24h</SelectItem>
              <SelectItem value="7d" className="text-white hover:bg-slate-700">Last 7 days</SelectItem>
              <SelectItem value="30d" className="text-white hover:bg-slate-700">Last 30 days</SelectItem>
              <SelectItem value="90d" className="text-white hover:bg-slate-700">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="performance" className="text-white hover:bg-slate-700">Performance</SelectItem>
              <SelectItem value="usage" className="text-white hover:bg-slate-700">Usage</SelectItem>
              <SelectItem value="errors" className="text-white hover:bg-slate-700">Errors</SelectItem>
              <SelectItem value="engagement" className="text-white hover:bg-slate-700">Engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {realTimeMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-green-400" />
                      )}
                      <span className="text-green-400 text-xs">{metric.change}</span>
                    </div>
                  </div>
                  <IconComponent className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="performance" className="text-slate-300">Performance</TabsTrigger>
          <TabsTrigger value="usage" className="text-slate-300">Usage Analytics</TabsTrigger>
          <TabsTrigger value="errors" className="text-slate-300">Error Analysis</TabsTrigger>
          <TabsTrigger value="engagement" className="text-slate-300">User Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Workflow Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="workflows" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span>Success Rate Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[95, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="success_rate" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Usage Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={usageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {usageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>AI API Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ai_calls" 
                      stroke="#f59e0b" 
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Error Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorAnalysis.map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium">{error.type}</span>
                        <Badge variant="outline" className={getStatusColor(error.status)}>
                          {error.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-slate-400 text-sm">{error.count} occurrences</span>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-400 text-sm">{error.percentage}% of total errors</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-lg">{error.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>User Engagement Patterns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active_users" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stackId="2"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
