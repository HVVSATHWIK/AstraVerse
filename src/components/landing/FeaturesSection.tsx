
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Shield, Workflow, BarChart3, Cog } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Automation",
      description: "Intelligent workflows that adapt and learn from your business patterns",
      badge: "Smart",
      color: "from-purple-600/10 to-purple-800/10 border-purple-500/30"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Lightning-fast data processing and instant insights across all channels",
      badge: "Fast",
      color: "from-blue-600/10 to-blue-800/10 border-blue-500/30"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and compliance",
      badge: "Secure",
      color: "from-green-600/10 to-green-800/10 border-green-500/30"
    },
    {
      icon: Workflow,
      title: "Seamless Integration",
      description: "Connect with 1000+ tools and platforms without any code",
      badge: "Connected",
      color: "from-orange-600/10 to-orange-800/10 border-orange-500/30"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights and predictive analytics for better decision making",
      badge: "Insights",
      color: "from-cyan-600/10 to-cyan-800/10 border-cyan-500/30"
    },
    {
      icon: Cog,
      title: "Custom Workflows",
      description: "Build and deploy custom AI workflows tailored to your needs",
      badge: "Custom",
      color: "from-pink-600/10 to-pink-800/10 border-pink-500/30"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative">
      <div className="text-center mb-16 animate-fade-in-3d">
        <h2 className="text-4xl font-bold text-white mb-4 text-3d">
          Powerful Features for Modern Enterprises
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Everything you need to orchestrate AI workflows at enterprise scale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={feature.title} 
            className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm card-3d hover-lift-3d interactive-card stagger-${(index % 6) + 1}`}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl backdrop-blur-sm animate-float-3d">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <Badge className="mx-auto mb-2 bg-white/10 text-white border-white/20 hover-glow">
                {feature.badge}
              </Badge>
              <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300 text-center leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
