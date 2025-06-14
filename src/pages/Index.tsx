
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Brain, 
  Database, 
  GitBranch, 
  MessageSquare, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2 text-sm">
              🚀 Enterprise AI Orchestration Platform
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              Astra<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade AI orchestration platform that unifies your workflow with intelligent automation, 
              real-time insights, and seamless integrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
                onClick={() => navigate('/dashboard')}
              >
                <Play className="w-5 h-5 mr-2" />
                Launch Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
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

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Deployment Tier
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From basic transcription to full enterprise orchestration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Tier */}
          <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Basic</CardTitle>
              <div className="text-3xl font-bold text-white mt-4">$99<span className="text-lg text-slate-400">/mo</span></div>
              <CardDescription className="text-blue-200">
                Perfect for small teams getting started with AI automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Meeting transcription</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />AI narrative reports</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Basic analytics dashboard</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />5 integrations included</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Email support</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Start Basic Trial
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/30 backdrop-blur-sm relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-600 text-white px-4 py-1">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Pro</CardTitle>
              <div className="text-3xl font-bold text-white mt-4">$299<span className="text-lg text-slate-400">/mo</span></div>
              <CardDescription className="text-purple-200">
                Advanced automation with intelligent scheduling and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-purple-100">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Everything in Basic</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Autonomous scheduling</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Churn prediction alerts</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Advanced workflow builder</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Priority support</li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className="bg-gradient-to-br from-amber-600/10 to-amber-800/10 border-amber-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
              <div className="text-3xl font-bold text-white mt-4">Custom</div>
              <CardDescription className="text-amber-200">
                Full orchestration with custom LLM training and on-premise options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-amber-100">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Everything in Pro</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Custom LLM fine-tuning</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />On-premise deployment</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />White-label options</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Dedicated success manager</li>
              </ul>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Enterprise?
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Join leading enterprises already using AstraAI to orchestrate their AI workflows and boost productivity by 40%.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => navigate('/dashboard')}
          >
            <Play className="w-5 h-5 mr-2" />
            Launch Dashboard
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
