
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AstraLogo from '@/components/AstraLogo';

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

  return (
    <div className="relative overflow-hidden perspective-container">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          {/* Floating 3D Logo */}
          <div className="flex justify-center mb-8 animate-float-3d">
            <div className="hover-lift-3d transform-3d">
              <AstraLogo size="xl" className="animate-pulse-3d" />
            </div>
          </div>

          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2 text-sm hover-glow animate-fade-in-3d">
            🚀 Enterprise AI Orchestration Platform
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight text-3d animate-scale-in-3d">
            Astra<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-wiggle-3d">AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-slide-up-3d">
            Enterprise-grade AI orchestration platform that unifies your workflow with intelligent automation, 
            real-time insights, and seamless integrations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in-3d">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg btn-3d hover-lift-3d"
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
                  Get Started
                </>
              )}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg btn-3d hover-lift-3d glass-dark"
            >
              Watch Demo
            </Button>
          </div>

          {/* Floating 3D accent elements */}
          <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-float-3d blur-xl transform-3d"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-full animate-background-float blur-lg transform-3d"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
