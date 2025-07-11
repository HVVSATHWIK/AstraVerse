
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const CTASection = () => {
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
    <div className="max-w-4xl mx-auto px-6 py-24 text-center relative perspective-container">
      {/* Floating 3D background elements */}
      <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full animate-float-3d blur-2xl transform-3d"></div>
      <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-full animate-background-float blur-xl transform-3d"></div>
      
      <div className="relative z-10 animate-fade-in-3d">
        <h2 className="text-4xl font-bold text-white mb-6 text-3d animate-scale-in-3d">
          Ready to Transform Your Enterprise?
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto animate-slide-up-3d">
          Join leading enterprises already using AstraAI to orchestrate their AI workflows and boost productivity by 40%.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in-3d">
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
                Get Started Free
              </>
            )}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg btn-3d hover-lift-3d glass-dark"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
