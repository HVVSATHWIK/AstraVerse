
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, Zap, BarChart3, Users, Shield } from 'lucide-react';
import InteractiveCard3D from '@/components/3D/InteractiveCard3D';

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Demand Forecasting",
      description: "Predict EV component demand with 95% accuracy using advanced machine learning algorithms",
      badge: "Predictive",
      color: "from-blue-600/10 to-blue-800/10 border-blue-500/30"
    },
    {
      icon: Package,
      title: "Automated Inventory Optimization",
      description: "Automatically adjust stock levels based on production schedules and market demand",
      badge: "Smart",
      color: "from-green-600/10 to-green-800/10 border-green-500/30"
    },
    {
      icon: Zap,
      title: "Real-time Stock Monitoring",
      description: "Instant alerts for low stock, overstock situations, and supply chain disruptions",
      badge: "Real-time",
      color: "from-purple-600/10 to-purple-800/10 border-purple-500/30"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Deep insights into inventory patterns, cost optimization, and production efficiency",
      badge: "Analytics",
      color: "from-cyan-600/10 to-cyan-800/10 border-cyan-500/30"
    },
    {
      icon: Users,
      title: "Supplier Integration",
      description: "Seamlessly connect with EV parts suppliers for automated procurement and delivery",
      badge: "Connected",
      color: "from-orange-600/10 to-orange-800/10 border-orange-500/30"
    },
    {
      icon: Shield,
      title: "Compliance & Traceability",
      description: "Ensure regulatory compliance and full component traceability for EV manufacturing",
      badge: "Compliant",
      color: "from-pink-600/10 to-pink-800/10 border-pink-500/30"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative">
      <div className="text-center mb-16 animate-fade-in-3d">
        <h2 className="text-4xl font-bold text-white mb-4 text-3d">
          Key Features for EV Manufacturing Excellence
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Everything you need to optimize inventory management for Electric Vehicle production
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <InteractiveCard3D key={feature.title} delay={index * 100}>
            <Card className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border-2 transition-all duration-500 h-full`}>
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
          </InteractiveCard3D>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
