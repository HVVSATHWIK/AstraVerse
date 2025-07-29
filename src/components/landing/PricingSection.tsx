
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
          Choose Your Deployment Tier
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          From basic transcription to full enterprise orchestration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Tier */}
        <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/30 backdrop-blur-sm card-3d hover-lift-3d animate-scale-in-3d stagger-1">
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white btn-3d hover-lift-3d">
              Start Basic Trial
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/30 backdrop-blur-sm relative card-3d hover-lift-3d animate-scale-in-3d stagger-2">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse-3d">
            <Badge className="bg-purple-600 text-white px-4 py-1 hover-glow">
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
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white btn-3d hover-lift-3d">
              Start Pro Trial
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Tier */}
        <Card className="bg-gradient-to-br from-amber-600/10 to-amber-800/10 border-amber-500/30 backdrop-blur-sm card-3d hover-lift-3d animate-scale-in-3d stagger-3">
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
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white btn-3d hover-lift-3d">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingSection;
