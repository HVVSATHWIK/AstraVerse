
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Database, 
  GitBranch, 
  MessageSquare, 
  Shield, 
  Zap,
  CheckCircle
} from 'lucide-react';

const FeaturesSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">
          Powerful AI Orchestration Features
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Everything you need to transform your enterprise operations with intelligent automation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* AI Engines */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <CardHeader>
            <Brain className="w-12 h-12 text-purple-400 mb-4" />
            <CardTitle className="text-white text-xl">Multi-AI Engines</CardTitle>
            <CardDescription className="text-slate-400">
              Combine rule-based Drools, LLM processing, and multi-modal pipelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Drools Business Rules</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />LLM Integration</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Multi-modal Processing</li>
            </ul>
          </CardContent>
        </Card>

        {/* Real-time Integrations */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <CardHeader>
            <MessageSquare className="w-12 h-12 text-blue-400 mb-4" />
            <CardTitle className="text-white text-xl">Smart Integrations</CardTitle>
            <CardDescription className="text-slate-400">
              Connect with Zoom, Slack, Jira, and more with intelligent workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Zoom Transcription</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Slack Automation</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Jira Integration</li>
            </ul>
          </CardContent>
        </Card>

        {/* Advanced Analytics */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <CardHeader>
            <Database className="w-12 h-12 text-green-400 mb-4" />
            <CardTitle className="text-white text-xl">Enterprise Data</CardTitle>
            <CardDescription className="text-slate-400">
              MongoDB, InfluxDB, and Milvus for comprehensive data management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Metadata Storage</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Time-series Analytics</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Vector Embeddings</li>
            </ul>
          </CardContent>
        </Card>

        {/* Workflow Automation */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <CardHeader>
            <GitBranch className="w-12 h-12 text-yellow-400 mb-4" />
            <CardTitle className="text-white text-xl">Workflow Builder</CardTitle>
            <CardDescription className="text-slate-400">
              Visual workflow designer with pre-built templates for common scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Drag & Drop Designer</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Pre-built Templates</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Real-time Monitoring</li>
            </ul>
          </CardContent>
        </Card>

        {/* Enterprise Security */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <CardHeader>
            <Shield className="w-12 h-12 text-red-400 mb-4" />
            <CardTitle className="text-white text-xl">Enterprise Security</CardTitle>
            <CardDescription className="text-slate-400">
              SOC2 compliant with end-to-end encryption and audit trails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />SOC2 Compliance</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />End-to-end Encryption</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Audit Trails</li>
            </ul>
          </CardContent>
        </Card>

        {/* Performance & Scale */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <CardHeader>
            <Zap className="w-12 h-12 text-cyan-400 mb-4" />
            <CardTitle className="text-white text-xl">Cloud Scale</CardTitle>
            <CardDescription className="text-slate-400">
              Kubernetes-native with auto-scaling and multi-cloud deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Auto-scaling</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Multi-cloud Ready</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />99.9% Uptime SLA</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesSection;
