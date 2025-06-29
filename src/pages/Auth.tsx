import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import AstraLogo from '@/components/AstraLogo';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  const toggleMode = (mode: 'login' | 'signup' | 'forgot-password') => {
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <AstraLogo size="lg" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Astra<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span>
          </h1>
          <p className="text-slate-400">Enterprise AI Orchestration Platform</p>
        </div>
        
        {authMode === 'login' && (
          <LoginForm 
            onToggleMode={() => toggleMode('signup')} 
            onForgotPassword={() => toggleMode('forgot-password')} 
          />
        )}
        
        {authMode === 'signup' && (
          <SignupForm onToggleMode={() => toggleMode('login')} />
        )}
        
        {authMode === 'forgot-password' && (
          <ForgotPasswordForm onToggleMode={() => toggleMode('login')} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;