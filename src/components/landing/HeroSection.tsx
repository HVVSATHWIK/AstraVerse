import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, LogIn, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import InvenAILogo from '@/components/InvenAILogo';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // This will redirect to auth if not logged in
    }
  };

  const handleRequestDemo = () => {
    // TODO: Implement demo request functionality
    console.log('Request demo clicked');
  };

  return (
    <div className="relative overflow-hidden perspective-container">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-green-800/20"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          {/* Floating 3D Logo */}
          <div className="flex justify-center mb-8 animate-float-3d">
            <div className="hover-lift-3d transform-3d">
              <InvenAILogo size="xl" className="animate-pulse-3d" />
            </div>
          </div>

          <Badge className="bg-green-600/20 text-green-300 border-green-500/50 px-4 py-2 text-sm hover-glow animate-fade-in-3d">
            <Zap className="w-4 h-4 mr-2" /> Smart Inventory Optimizer for EV Manufacturing
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight text-3d animate-scale-in-3d">
            Inven<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 animate-wiggle-3d">AI</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-slate-200 max-w-4xl mx-auto leading-relaxed animate-slide-up-3d font-semibold">
            Revolutionizing EV Inventory with Predictive Intelligence
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-slide-up-3d">
            Leverage AI-powered forecasting and real-time insights to eliminate stockouts and overstock, 
            ensuring seamless EV production. Unlock unparalleled efficiency and cost savings through 
            intelligent demand prediction and automated inventory optimization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in-3d">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg btn-3d hover-lift-3d"
              onClick={handleRequestDemo}
            >
              <Zap className="w-5 h-5 mr-2" />
              Request a Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg btn-3d hover-lift-3d glass-dark"
              onClick={handleGetStarted}
            >
              {user ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Launch Dashboard
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Get Started Free
                </>
              )}
            </Button>
          </div>

          {/* Problem/Solution Statement */}
          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-lg text-slate-400 italic">
              "Manual inventory leads to costly delays and waste in EV production. 
              InvenAI provides intelligent automation for optimal inventory management."
            </p>
          </div>

          {/* Floating 3D accent elements - EV themed */}
          <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full animate-float-3d blur-xl transform-3d"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full animate-background-float blur-lg transform-3d"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;