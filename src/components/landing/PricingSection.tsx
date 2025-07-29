
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';

const PricingSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16 animate-fade-in-3d">
        <h2 className="text-4xl font-bold text-white mb-4 text-3d">
          Choose Your Optimization Tier
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          From basic inventory tracking to full predictive optimization for EV manufacturing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Starter Tier */}
        <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/30 backdrop-blur-sm card-3d hover-lift-3d animate-scale-in-3d stagger-1">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Starter</CardTitle>
            <div className="text-3xl font-bold text-white mt-4">$499<span className="text-lg text-slate-400">/mo</span></div>
            <CardDescription className="text-blue-200">
              Perfect for small EV manufacturers getting started with smart inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Basic demand forecasting</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Inventory tracking dashboard</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Stock level alerts</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Up to 5 suppliers integrated</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Email & chat support</li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white btn-3d hover-lift-3d">
              Start Free Trial
            </Button>
          </CardContent>
        </Card>

        {/* Professional Tier */}
        <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/30 backdrop-blur-sm relative card-3d hover-lift-3d animate-scale-in-3d stagger-2">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse-3d">
            <Badge className="bg-green-600 text-white px-4 py-1 hover-glow">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Professional</CardTitle>
            <div className="text-3xl font-bold text-white mt-4">$1,299<span className="text-lg text-slate-400">/mo</span></div>
            <CardDescription className="text-green-200">
              Advanced AI optimization with predictive analytics and automation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-green-100">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Everything in Starter</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />AI-powered demand forecasting</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Automated reorder points</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Production schedule integration</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Priority support & training</li>
            </ul>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white btn-3d hover-lift-3d">
              Start Professional Trial
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Tier */}
        <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/30 backdrop-blur-sm card-3d hover-lift-3d animate-scale-in-3d stagger-3">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
            <div className="text-3xl font-bold text-white mt-4">Custom</div>
            <CardDescription className="text-purple-200">
              Full-scale optimization with custom AI models and on-premise deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-purple-100">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Everything in Professional</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Custom AI model training</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />On-premise deployment</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Unlimited supplier integrations</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-3" />Dedicated success manager</li>
            </ul>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white btn-3d hover-lift-3d">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingSection;
